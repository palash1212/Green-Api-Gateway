import { useState, useEffect } from "react";
import { FaTachometerAlt, FaLeaf, FaServer } from "react-icons/fa";
import Charts from "../components/Charts";
import DashboardCards from "../components/DashboardCards";
import useAxiosPublic from "../hooks/useAxiosPublic";

export default function Dashboard() {
  const [apis, setApis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // 🔹 Fetch APIs from backend (like ApiManagement.jsx)
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch APIs
      const apisResponse = await axiosPublic.get("/apis");
      if (apisResponse.data.success) {
        const apiData = apisResponse.data.data || [];
        setApis(apiData);
        
        // Calculate stats based on real API data
        calculateStats(apiData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setApis([]);
      setStats(getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apiData) => {
    if (!apiData || apiData.length === 0) {
      setStats(getDefaultStats());
      return;
    }

    // Calculate totals from all APIs (same logic as ApiManagement)
    const totals = apiData.reduce(
      (acc, api) => {
        // Daily requests (from API configuration)
        const dailyRequests = api.dailyRequests || 1000;
        acc.todayRequests += dailyRequests;

        // Weekly requests (7 days)
        acc.weekRequests += dailyRequests * 7;

        // Data transferred (avgPayload in KB, convert to MB)
        const avgPayloadKB = api.avgPayload || 50;
        const dailyDataMB = (avgPayloadKB * dailyRequests) / 1024; // KB to MB
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

        // Track green APIs
        if (api.greenScore === "Green") {
          acc.greenAPICount++;
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
        greenAPICount: 0,
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
        : 150; // Default fallback

    // Estimate trees needed (roughly 21 kg CO2 per tree per year, convert to daily)
    // Assuming 1 tree absorbs 21,000g CO2 per year ≈ 57.5g per day
    const dailyCO2 = totals.co2Emission;
    const treesNeeded = dailyCO2 / 57.5;

    // Calculate week-over-week change (mock data for now)
    const weekChange = apiData.length > 0 ? -12 : 0; // Example: 12% improvement

    const calculatedStats = {
      todayRequests: Math.round(totals.todayRequests),
      weekRequests: Math.round(totals.weekRequests),
      dataTransferredGB: dataTransferredGB.toFixed(2),
      todayDataMB: Math.round(totals.todayDataMB),
      energyUsedWh: Math.round(totals.energyUsedWh),
      energyKwh: energyKwh.toFixed(2),
      co2Emission: Math.round(totals.co2Emission),
      treesNeeded: treesNeeded > 0.1 ? treesNeeded.toFixed(1) : "0",
      avgResponseTime,
      greenAPICount: totals.greenAPICount,
      totalAPIs: apiData.length,
      weekChange,
    };

    setStats(calculatedStats);
  };

  const getDefaultStats = () => {
    return {
      todayRequests: 0,
      weekRequests: 0,
      dataTransferredGB: "0.00",
      todayDataMB: 0,
      energyUsedWh: 0,
      energyKwh: "0.00",
      co2Emission: 0,
      treesNeeded: "0",
      avgResponseTime: 0,
      greenAPICount: 0,
      totalAPIs: 0,
      weekChange: 0,
    };
  };

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow">
            <FaTachometerAlt className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              System Health & Sustainability Snapshot
            </h2>
            <p className="text-gray-600">
              Real-time monitoring of API environmental impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="font-medium text-green-700">
              {stats?.greenAPICount || 0} Green APIs
            </span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="font-medium text-gray-700">
              {stats?.totalAPIs || 0} Total APIs
            </span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaLeaf />
            Refresh
          </button>
        </div>
      </div>

      {/* Empty State */}
      {apis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaServer className="text-2xl text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No APIs Monitored Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding APIs to track their environmental impact and energy consumption
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track API energy consumption</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Monitor CO₂ emissions</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Get sustainability scores</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <DashboardCards stats={stats} />

          {/* Charts */}
          <Charts />

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border border-green-200">
            <h3 className="font-semibold text-lg text-green-800 mb-4">
              Environmental Impact Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">Daily Energy Equivalent</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {stats.energyKwh} kWh
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Powers {((parseFloat(stats.energyKwh) || 0) * 1000 / 60).toFixed(1)} LED bulbs for a day
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">Weekly CO₂ Impact</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {(stats.co2Emission * 7).toLocaleString()} g
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Equivalent to driving {(stats.co2Emission * 7 / 2000).toFixed(2)} km in a car
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">Data Efficiency</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {stats.dataTransferredGB} GB/day
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.avgResponseTime} ms avg response time
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}