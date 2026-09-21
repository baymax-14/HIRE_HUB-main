import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { ANALYTICS_API_END_POINT } from "@/util/const";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Building2,
  Clock,
  Loader2,
} from "lucide-react";
import { Badge } from "../ui/badge";

export default function Dashboard() {
  const { user } = useSelector((store) => store.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ANALYTICS_API_END_POINT}/dashboard`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  // Colors
  const FUNNEL_COLORS = ["#f59e0b", "#22c55e", "#ef4444"];
  const ATS_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
  const AREA_GRADIENT_ID = "colorApplications";

  // Funnel data for pie chart
  const funnelData = [
    { name: "Pending", value: stats.funnel.pending },
    { name: "Accepted", value: stats.funnel.accepted },
    { name: "Rejected", value: stats.funnel.rejected },
  ].filter((d) => d.value > 0);

  // Stat cards config
  const statCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Applicants",
      value: stats.totalApplicants,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Acceptance Rate",
      value: `${stats.acceptanceRate}%`,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Avg ATS Score",
      value: stats.avgAtsScore,
      icon: Award,
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-100 px-4 py-3">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.fullname?.split(" ")[0]}! Here's your hiring overview.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${card.bgLight} flex items-center justify-center`}
                >
                  <card.icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applications Over Time */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Applications (Last 7 Days)
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.applicationsTimeline}>
                  <defs>
                    <linearGradient
                      id={AREA_GRADIENT_ID}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Applications"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fill={`url(#${AREA_GRADIENT_ID})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hiring Funnel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Hiring Funnel
            </h3>
            <div className="h-[280px]">
              {funnelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={funnelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {funnelData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No application data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ATS Score Distribution */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              ATS Score Distribution
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.atsDistribution} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Applicants" radius={[6, 6, 0, 0]}>
                    {stats.atsDistribution.map((_, index) => (
                      <Cell
                        key={`ats-${index}`}
                        fill={ATS_COLORS[index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Jobs by Applicants */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Top Jobs by Applicants
            </h3>
            <div className="h-[280px]">
              {stats.topJobs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.topJobs}
                    layout="vertical"
                    barCategoryGap="25%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="title"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Applicants"
                      fill="#8B5CF6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No job data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {activity.applicant?.fullname
                      ?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.applicant?.fullname || "Unknown"}{" "}
                      <span className="font-normal text-gray-500">
                        applied for
                      </span>{" "}
                      {activity.job?.title || "Unknown Job"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <Badge
                    variant="secondary"
                    className={`text-xs capitalize ${
                      activity.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {activity.status}
                  </Badge>

                  {/* ATS Score */}
                  {activity.aiEvaluation?.score > 0 && (
                    <div
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        activity.aiEvaluation.score >= 75
                          ? "bg-green-100 text-green-700"
                          : activity.aiEvaluation.score >= 50
                          ? "bg-blue-100 text-blue-700"
                          : activity.aiEvaluation.score >= 25
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      ATS: {activity.aiEvaluation.score}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
