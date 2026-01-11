import { FaTachometerAlt } from "react-icons/fa";
import Charts from "../components/Charts";
import DashboardCards from "../components/DashboardCards";
import { useMemo } from "react";

export default function Dashboard() {
  // 🔹 Get APIs from localStorage
  const apis = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("apis")) || [];
    } catch {
      return [];
    }
  }, []);

  // 🔹 Calculate dynamic stats from user's APIs
  const stats = useMemo(() => {
    if (!apis.length) {
      return {
        todayRequests: 0,
        weekRequests: 0,
        dataTransferredGB: 0,
        todayDataMB: 0,
        energyUsedWh: 0,
        energyKwh: 0,
        co2Emission: 0,
        treesNeeded: 0,
        avgResponseTime: 0,
      };
    }

    // Calculate totals from all APIs
    const totals = apis.reduce(
      (acc, api) => {
        // Daily requests
        acc.todayRequests += api.dailyRequests || 0;

        // Weekly requests (assuming dailyRequests is per day, so ×7 for week)
        acc.weekRequests += (api.dailyRequests || 0) * 7;

        // Data transferred (in MB initially)
        const dailyDataMB =
          ((api.avgPayload || 0) * (api.dailyRequests || 0)) / 1024; // Convert KB to MB
        acc.todayDataMB += dailyDataMB;

        // Energy used (already calculated in API data)
        acc.energyUsedWh += api.energyUsed || 0;

        // CO2 emission (already calculated in API data)
        acc.co2Emission += api.co2 || 0;

        // Response time (average across all APIs)
        if (api.responseTime) {
          acc.totalResponseTime += api.responseTime;
          acc.apiCountWithResponseTime++;
        }

        return acc;
      },
      {
        todayRequests: 0,
        weekRequests: 0,
        todayDataMB: 0,
        energyUsedWh: 0,
        co2Emission: 0,
        totalResponseTime: 0,
        apiCountWithResponseTime: 0,
      }
    );

    // Convert data transferred to GB for display
    const dataTransferredGB = totals.todayDataMB / 1024;

    // Convert energy to kWh (1 kWh = 1000 Wh)
    const energyKwh = totals.energyUsedWh / 1000;

    // Calculate average response time
    const avgResponseTime =
      totals.apiCountWithResponseTime > 0
        ? Math.round(totals.totalResponseTime / totals.apiCountWithResponseTime)
        : 0;

    // Estimate trees needed (roughly 21 kg CO2 per tree per year, convert to daily)
    // Assuming 1 tree absorbs 21,000g CO2 per year ≈ 57.5g per day
    const dailyCO2 = totals.co2Emission; // This is already daily
    const treesNeeded = dailyCO2 / 57.5;

    return {
      todayRequests: Math.round(totals.todayRequests),
      weekRequests: Math.round(totals.weekRequests),
      dataTransferredGB: dataTransferredGB.toFixed(2),
      todayDataMB: Math.round(totals.todayDataMB),
      energyUsedWh: Math.round(totals.energyUsedWh),
      energyKwh: energyKwh.toFixed(2),
      co2Emission: Math.round(totals.co2Emission),
      treesNeeded: treesNeeded.toFixed(1),
      avgResponseTime,
    };
  }, [apis]);

  return (
    <>
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaTachometerAlt className="text-green-600" />
        </span>
        System Health & Sustainability Snapshot
        <span className="ml-4 text-sm font-normal bg-gray-100 px-3 py-1 rounded-full">
          {apis.length} API{apis.length !== 1 ? "s" : ""} monitored
        </span>
      </h2>

      {/* ✅ Dynamic cards based on user's APIs */}
      <DashboardCards stats={stats} />

      <Charts />
    </>
  );
}
