const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
export const NOTIFICATION_API_END_POINT = `${BASE_URL}/notifications`;
export const ANALYTICS_API_END_POINT = `${BASE_URL}/analytics`;

/**
 * Formats a salary value cleanly as e.g. "45 LPA".
 * Automatically handles both raw INR amounts (e.g. 4500000 -> 45 LPA)
 * and direct LPA values (e.g. 45 -> 45 LPA).
 */
export const formatSalary = (salary) => {
  if (salary === null || salary === undefined || salary === "") return "Not disclosed";
  const num = Number(salary);
  if (isNaN(num) || num <= 0) return `${salary} LPA`;
  if (num >= 100000) {
    const lpa = num / 100000;
    return `${Number(lpa.toFixed(2))} LPA`;
  }
  return `${num} LPA`;
};
