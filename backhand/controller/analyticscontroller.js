import { Job } from "../models/jobmodel.js";
import { Application } from "../models/applicationmodel.js";
import { Company } from "../models/companymodel.js";
import { User } from "../models/usermodel.js";

/**
 * GET /api/v1/analytics/dashboard
 * Returns aggregated stats for the recruiter's dashboard
 */
export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.id;

    // 1. Get all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ created_by: recruiterId }).select("_id title");
    const jobIds = recruiterJobs.map((j) => j._id);

    // 2. Total counts
    const totalJobs = recruiterJobs.length;
    const totalCompanies = await Company.countDocuments({ userId: recruiterId });
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

    // 3. Hiring funnel — status breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const funnel = { pending: 0, accepted: 0, rejected: 0 };
    statusBreakdown.forEach((s) => {
      if (funnel.hasOwnProperty(s._id)) {
        funnel[s._id] = s.count;
      }
    });

    // 4. ATS score distribution (4 buckets)
    const scoreDistribution = await Application.aggregate([
      { $match: { job: { $in: jobIds }, "aiEvaluation.score": { $gt: 0 } } },
      {
        $bucket: {
          groupBy: "$aiEvaluation.score",
          boundaries: [0, 25, 50, 75, 101],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    const atsDistribution = [
      { range: "0-25", count: 0 },
      { range: "25-50", count: 0 },
      { range: "50-75", count: 0 },
      { range: "75-100", count: 0 },
    ];
    const bucketMap = { 0: 0, 25: 1, 50: 2, 75: 3 };
    scoreDistribution.forEach((b) => {
      if (bucketMap.hasOwnProperty(b._id)) {
        atsDistribution[bucketMap[b._id]].count = b.count;
      }
    });

    // 5. Average ATS score
    const avgScoreResult = await Application.aggregate([
      { $match: { job: { $in: jobIds }, "aiEvaluation.score": { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: "$aiEvaluation.score" } } },
    ]);
    const avgAtsScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // 6. Acceptance rate
    const acceptanceRate =
      totalApplicants > 0
        ? Math.round((funnel.accepted / totalApplicants) * 100)
        : 0;

    // 7. Recent activity — last 10 applications
    const recentActivity = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("applicant", "fullname email profile.profilephoto")
      .populate("job", "title")
      .lean();

    // 8. Top jobs by applicant count
    const topJobs = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      { $unwind: "$jobInfo" },
      {
        $project: {
          _id: 1,
          count: 1,
          title: "$jobInfo.title",
        },
      },
    ]);

    // 9. Applications over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyApplications = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const applicationsTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = dailyApplications.find((a) => a._id === dateStr);
      applicationsTimeline.push({
        date: dateStr,
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        count: found ? found.count : 0,
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalCompanies,
        totalApplicants,
        avgAtsScore,
        acceptanceRate,
        funnel,
        atsDistribution,
        recentActivity,
        topJobs,
        applicationsTimeline,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};
