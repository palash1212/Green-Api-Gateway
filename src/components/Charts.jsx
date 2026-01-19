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
import useAxiosPublic from "../hooks/useAxiosPublic";

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
  const axiosPublic = useAxiosPublic();

  // Fetch APIs from backend
  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get("/apis");
      if (response.data.success) {
        setApis(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data using useMemo
  const { requestData, co2Data, energyData } = useMemo(() => {
    if (apis.length === 0) {
      return {
        requestData: [],
        co2Data: [],
        energyData: []
      };
    }

    // Get top 10 APIs by daily requests
    const sortedByRequests = [...apis]
      .sort((a, b) => (b.dailyRequests || 0) - (a.dailyRequests || 0))
      .slice(0, 10);

    const requestData = sortedByRequests.map(api => ({
      name: api.name?.length > 15 ? api.name.substring(0, 15) + '...' : api.name,
      requests: api.dailyRequests || 1000,
      method: api.method,
      responseTime: api.responseTime || 150,
      greenScore: api.greenScore || "Medium"
    }));

    // Get top 6 APIs by CO2 emissions
    const sortedByCO2 = [...apis]
      .sort((a, b) => (b.co2 || 0) - (a.co2 || 0))
      .slice(0, 6);

    const co2Data = sortedByCO2.map(api => ({
      name: api.name?.length > 15 ? api.name.substring(0, 15) + '...' : api.name,
      co2: api.co2 || 0,
      region: api.region || "Global Average",
      greenScore: api.greenScore || "Medium"
    }));

    // Get energy data
    const energyData = sortedByRequests.map(api => api.energyUsed || 0);

    return {
      requestData,
      co2Data,
      energyData
    };
  }, [apis]);

  // Line Chart Data - API Requests with Energy Usage
  const requestsChart = {
    labels: requestData.length > 0 
      ? requestData.map(d => d.name) 
      : ["No APIs Available"],
    datasets: [
      {
        label: "Daily Requests",
        data: requestData.length > 0 
          ? requestData.map(d => d.requests) 
          : [0],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Energy Usage (Wh)",
        data: requestData.length > 0 
          ? energyData 
          : [0],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ],
  };

  // Pie Chart Data - CO2 Emissions by API
  const co2Chart = {
    labels: co2Data.length > 0 
      ? co2Data.map(d => d.name) 
      : ["No APIs Available"],
    datasets: [
      {
        data: co2Data.length > 0 
          ? co2Data.map(d => d.co2) 
          : [1],
        backgroundColor: [
          "#EF4444", // Red for highest CO2
          "#F59E0B", // Orange
          "#10B981", // Green
          "#3B82F6", // Blue
          "#8B5CF6", // Purple
          "#EC4899"  // Pink
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
        position: 'top',
        labels: {
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Requests')) {
                label += context.parsed.y.toLocaleString();
              } else if (label.includes('Energy')) {
                label += context.parsed.y.toFixed(2) + ' Wh';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Daily Requests'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Energy (Wh)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          font: {
            size: 11
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)} g CO₂`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      {/* Line Chart - API Requests Overview */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          API Requests & Energy Usage
        </h3>
        <div className="h-80">
          {apis.length > 0 ? (
            <Line data={requestsChart} options={lineChartOptions} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg mb-2">No API Data Available</p>
              <p className="text-sm">Add APIs to see request and energy analytics</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Daily Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Energy Usage (Wh)</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Showing top {Math.min(10, apis.length)} APIs by request volume
          </p>
        </div>
      </div>

      {/* Pie Chart - CO2 Emissions */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          CO₂ Emissions by API
        </h3>
        <div className="h-80">
          {apis.length > 0 ? (
            <Pie data={co2Chart} options={pieChartOptions} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg mb-2">No API Data Available</p>
              <p className="text-sm">Add APIs to see CO₂ emissions</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600">
            {co2Data.length > 0 ? (
              <>
                <p className="font-medium">Top CO₂ Emitters:</p>
                <ul className="mt-2 space-y-1">
                  {co2Data.slice(0, 3).map((api, index) => (
                    <li key={index} className="flex justify-between items-center text-xs">
                      <span className="truncate">{api.name}</span>
                      <span className="font-medium">{api.co2.toFixed(2)} g</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-xs text-gray-500">No CO₂ data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {apis.length > 0 && (
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700 font-medium">Total APIs</div>
            <div className="text-2xl font-bold text-blue-800">{apis.length}</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 font-medium">Total Energy</div>
            <div className="text-2xl font-bold text-green-800">
              {apis.reduce((sum, api) => sum + (api.energyUsed || 0), 0).toFixed(2)} Wh
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 font-medium">Total CO₂</div>
            <div className="text-2xl font-bold text-red-800">
              {apis.reduce((sum, api) => sum + (api.co2 || 0), 0).toFixed(2)} g
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-700 font-medium">Green APIs</div>
            <div className="text-2xl font-bold text-purple-800">
              {apis.filter(api => api.greenScore === "Green").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;