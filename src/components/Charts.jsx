import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
import { FaBolt, FaCloud, FaLeaf, FaServer } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:5000";

  // Fetch APIs from backend
  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/allApiList`);
      setApis(response.data || []);
    } catch (error) {
      console.error("Error fetching APIs:", error);
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data using useMemo
  const { requestData, co2Data, energyData, greenStatusCounts } =
    useMemo(() => {
      if (apis.length === 0) {
        return {
          requestData: [],
          co2Data: [],
          energyData: [],
          greenStatusCounts: { GREEN: 0, WARNING: 0, NOT_GREEN: 0 },
        };
      }

      // Get top 10 APIs by CO2 emissions (using actual data from backend)
      const sortedByCO2 = [...apis]
        .sort((a, b) => (b.co2EmissionMg || 0) - (a.co2EmissionMg || 0))
        .slice(0, 10);

      const requestData = sortedByCO2.map((api) => ({
        name:
          api.apiName || api.apiUrl?.substring(0, 20) + "..." || "Unnamed API",
        co2: api.co2EmissionMg || 0,
        responseTime: api.responseTimeMs || 150,
        greenStatus: api.greenStatus || "NOT GREEN",
        payload: api.payloadSizeKB || 0,
      }));

      // Get top 6 APIs by CO2 emissions for pie chart
      const topCO2 = [...apis]
        .sort((a, b) => (b.co2EmissionMg || 0) - (a.co2EmissionMg || 0))
        .slice(0, 6);

      const co2Data = topCO2.map((api) => ({
        name: api.apiName || api.apiUrl?.split("/").pop() || "API",
        co2: api.co2EmissionMg || 0,
        greenStatus: api.greenStatus || "NOT GREEN",
        energy: api.energyUsedWh || 0,
      }));

      // Get energy data for line chart
      const energyData = sortedByCO2.map((api) => api.energyUsedWh || 0);

      // Count green statuses
      const greenStatusCounts = apis.reduce(
        (acc, api) => {
          const status = api.greenStatus || "NOT GREEN";
          if (status === "GREEN") acc.GREEN++;
          else if (status.includes("WARNING")) acc.WARNING++;
          else acc.NOT_GREEN++;
          return acc;
        },
        { GREEN: 0, WARNING: 0, NOT_GREEN: 0 }
      );

      return {
        requestData,
        co2Data,
        energyData,
        greenStatusCounts,
      };
    }, [apis]);

  // Line Chart Data - CO2 Emissions vs Response Time
  const emissionsChart = {
    labels:
      requestData.length > 0
        ? requestData.map((d) => d.name)
        : ["No APIs Available"],
    datasets: [
      {
        label: "CO₂ Emissions (mg)",
        data: requestData.length > 0 ? requestData.map((d) => d.co2) : [0],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Response Time (ms)",
        data:
          requestData.length > 0 ? requestData.map((d) => d.responseTime) : [0],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  // Pie Chart Data - CO2 Emissions by API
  const co2Chart = {
    labels:
      co2Data.length > 0 ? co2Data.map((d) => d.name) : ["No APIs Available"],
    datasets: [
      {
        data: co2Data.length > 0 ? co2Data.map((d) => d.co2) : [1],
        backgroundColor: [
          "#EF4444", // Red for highest CO2
          "#F59E0B", // Orange
          "#10B981", // Green
          "#3B82F6", // Blue
          "#8B5CF6", // Purple
          "#EC4899", // Pink
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  // Pie Chart Data - Green Status Distribution
  const greenStatusChart = {
    labels: ["Green", "Warning", "Not Green"],
    datasets: [
      {
        data: [
          greenStatusCounts.GREEN,
          greenStatusCounts.WARNING,
          greenStatusCounts.NOT_GREEN,
        ],
        backgroundColor: [
          "#10B981", // Green
          "#F59E0B", // Yellow/Orange
          "#EF4444", // Red
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  // Line Chart Options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (label.includes("CO₂")) {
                label += context.parsed.y.toFixed(2) + " mg";
              } else if (label.includes("Response")) {
                label += context.parsed.y.toFixed(0) + " ms";
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "CO₂ Emissions (mg)",
          color: "#EF4444",
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(0);
          },
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Response Time (ms)",
          color: "#3B82F6",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)} mg CO₂`;
          },
        },
      },
    },
  };

  // Green Status Pie Chart Options
  const greenPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} APIs (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-10">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart - CO2 Emissions vs Response Time */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-green-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              CO₂ Emissions vs Response Time
            </h3>
            <button
              onClick={fetchApis}
              className="px-3 py-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="h-80">
            {apis.length > 0 ? (
              <Line data={emissionsChart} options={lineChartOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FaCloud className="text-4xl mb-2 opacity-50" />
                <p className="text-lg mb-2">No API Data Available</p>
                <p className="text-sm">
                  Analyze APIs to see emissions analytics
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2 font-medium">Top CO₂ Emitting APIs:</p>
            <div className="grid grid-cols-2 gap-2">
              {requestData.slice(0, 4).map((api, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                  <div className="flex justify-between">
                    <span className="truncate">{api.name}</span>
                    <span className="font-medium">{api.co2.toFixed(2)} mg</span>
                  </div>
                  <div className="text-gray-500">
                    {api.responseTime} ms • {api.payload.toFixed(2)} KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart - Green Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Green Status Distribution
          </h3>
          <div className="h-64">
            {apis.length > 0 ? (
              <Pie data={greenStatusChart} options={greenPieChartOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FaLeaf className="text-4xl mb-2 opacity-50" />
                <p className="text-lg mb-2">No API Data</p>
                <p className="text-sm">Add APIs to see green status</p>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Green APIs</span>
              </div>
              <span className="font-medium">{greenStatusCounts.GREEN}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Warning APIs</span>
              </div>
              <span className="font-medium">{greenStatusCounts.WARNING}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Not Green APIs</span>
              </div>
              <span className="font-medium">{greenStatusCounts.NOT_GREEN}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CO2 Emissions Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Top CO₂ Emitting APIs
        </h3>
        <div className="h-80">
          {apis.length > 0 ? (
            <Pie data={co2Chart} options={pieChartOptions} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <FaCloud className="text-4xl mb-2 opacity-50" />
              <p className="text-lg mb-2">No CO₂ Data Available</p>
              <p className="text-sm">
                Analyze APIs to see emissions distribution
              </p>
            </div>
          )}
        </div>
        {co2Data.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              API Emissions Details:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {co2Data.map((api, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm truncate">
                      {api.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        api.greenStatus === "GREEN"
                          ? "bg-green-100 text-green-700"
                          : api.greenStatus.includes("WARNING")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {api.greenStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>CO₂:</span>
                      <span className="font-medium">
                        {api.co2.toFixed(2)} mg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Energy:</span>
                      <span className="font-medium">
                        {api.energy.toFixed(6)} Wh
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {apis.length === 0 && !loading && (
        <div className="bg-linear-to-r from-green-50 to-blue-50 p-8 rounded-xl border border-green-300 text-center">
          <FaServer className="text-5xl text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Start Analyzing APIs
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't analyzed any APIs yet. Use the API Management page to
            analyze your first API and see analytics here.
          </p>
          <button
            onClick={() => (window.location.href = "/api-management")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to API Analyzer
          </button>
        </div>
      )}
    </div>
  );
};

export default Charts;
