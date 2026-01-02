import React from "react";
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
import { Line, Bar, Pie } from "react-chartjs-2";

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
  const requestsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "API Requests",
        data: [3200, 4100, 3800, 5200, 6100, 4500, 3900],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const co2Data = {
    labels: [
      "/api/images",
      "/api/products",
      "/api/users",
      "/api/orders",
      "/api/others",
    ],
    datasets: [
      {
        data: [403, 287, 153, 61, 96],
        backgroundColor: [
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#3B82F6",
          "#8B5CF6",
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const energyData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Energy Used (Wh)",
        data: [320, 410, 380, 520, 610, 450, 390],
        backgroundColor: "#F59E0B",
        borderColor: "#D97706",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}g CO₂`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            API Requests Over Time
          </h3>
          <div className="h-80">
            <Line data={requestsData} options={options} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            CO₂ Emission by API
          </h3>
          <div className="h-80">
            <Pie data={co2Data} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Energy Usage Per Day (Last 7 Days)
        </h3>
        <div className="h-80">
          <Bar data={energyData} options={options} />
        </div>
      </div>
    </>
  );
};

export default Charts;
