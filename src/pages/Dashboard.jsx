import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaLeaf,
  FaServer,
  FaBolt,
  FaCloud,
} from "react-icons/fa";
import Charts from "../components/Charts";
import DashboardCards from "../components/DashboardCards";
import axios from "axios";

export default function Dashboard() {
  const [apis, setApis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:5000";

  // 🔹 Fetch APIs from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch APIs - using the correct endpoint
      const apisResponse = await axios.get(`${API_BASE_URL}/allApiList`);
      const apiData = apisResponse.data || [];
      setApis(apiData);

      // Calculate stats based on real API data
      calculateStats(apiData);
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

    // Calculate totals from all APIs using the actual data structure
    const totals = apiData.reduce(
      (acc, api) => {
        // Energy used (from your backend data)
        acc.energyUsedWh += parseFloat(api.energyUsedWh) || 0;

        // CO2 emission (from your backend data)
        acc.co2EmissionMg += parseFloat(api.co2EmissionMg) || 0;

        // Response time (average across all APIs)
        if (api.responseTimeMs) {
          acc.totalResponseTime += api.responseTimeMs;
          acc.apiCountWithResponseTime++;
        }

        // Track green APIs
        if (api.greenStatus === "GREEN") {
          acc.greenAPICount++;
        }

        // Calculate data transferred based on payload size
        const payloadKB = parseFloat(api.payloadSizeKB) || 0;
        const payloadMB = payloadKB / 1024;
        acc.totalPayloadMB += payloadMB;

        // Count API calls (estimating for visualization)
        const estimatedCalls = 1000;
        acc.todayRequests += estimatedCalls;
        acc.weekRequests += estimatedCalls * 7;

        return acc;
      },
      {
        todayRequests: 0,
        weekRequests: 0,
        totalPayloadMB: 0,
        energyUsedWh: 0,
        co2EmissionMg: 0,
        totalResponseTime: 0,
        apiCountWithResponseTime: 0,
        greenAPICount: 0,
      }
    );

    // Calculate averages
    const avgResponseTime =
      totals.apiCountWithResponseTime > 0
        ? Math.round(totals.totalResponseTime / totals.apiCountWithResponseTime)
        : 0;

    // Convert data to appropriate units
    const dataTransferredGB = totals.totalPayloadMB / 1024;
    const energyKwh = totals.energyUsedWh / 1000;
    const co2EmissionG = totals.co2EmissionMg / 1000;

    // Estimate trees needed
    const dailyCO2G = co2EmissionG;
    const treesNeeded = dailyCO2G / 57.5;

    // Ensure all values are numbers
    const calculatedStats = {
      todayRequests: Math.round(totals.todayRequests),
      weekRequests: Math.round(totals.weekRequests),
      dataTransferredGB: dataTransferredGB.toFixed(2),
      energyUsedWh: totals.energyUsedWh.toFixed(6),
      energyKwh: energyKwh.toFixed(6),
      co2EmissionMg: totals.co2EmissionMg.toFixed(2),
      co2EmissionG: co2EmissionG.toFixed(2),
      treesNeeded: treesNeeded > 0.1 ? treesNeeded.toFixed(1) : "0",
      avgResponseTime,
      greenAPICount: totals.greenAPICount,
      totalAPIs: apiData.length,
      weekChange: apiData.length > 0 ? -8 : 0,
      efficiencyScore:
        totals.greenAPICount > 0
          ? Math.round((totals.greenAPICount / apiData.length) * 100)
          : 0,
      totalPayloadMB: totals.totalPayloadMB.toFixed(2),
    };

    setStats(calculatedStats);
  };

  const getDefaultStats = () => {
    return {
      todayRequests: 0,
      weekRequests: 0,
      dataTransferredGB: "0.00",
      energyUsedWh: "0.000000",
      energyKwh: "0.000000",
      co2EmissionMg: "0.00",
      co2EmissionG: "0.00",
      treesNeeded: "0",
      avgResponseTime: 0,
      greenAPICount: 0,
      totalAPIs: 0,
      weekChange: 0,
      efficiencyScore: 0,
      totalPayloadMB: "0.00",
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl shadow">
            <FaTachometerAlt className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              API Energy & Sustainability Dashboard
            </h2>
            <p className="text-gray-600">
              Monitor environmental impact of your APIs in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm bg-linear-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
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
            className="px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
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
            No APIs Analyzed Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start analyzing APIs to track their environmental impact and energy
            consumption
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaBolt className="text-green-500" />
              <span>Track API energy consumption (Wh)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaCloud className="text-blue-500" />
              <span>Monitor CO₂ emissions (mg)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaLeaf className="text-green-600" />
              <span>Get green status ratings</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => (window.location.href = "/api-management")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to API Analyzer
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {stats && <DashboardCards stats={stats} />}

          {/* Charts Component */}
          <Charts />

          {/* API Performance Tips */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Sustainability Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">
                  Reduce Payload Size
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Smaller responses = less energy. Use compression and field
                  filtering.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">Optimize Caching</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cache responses to reduce server load and energy consumption.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">Monitor Regularly</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Check API health and green status frequently for improvements.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
