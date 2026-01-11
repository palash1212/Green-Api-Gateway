import React, { useMemo } from "react";
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

/* =========================
   Deterministic helper
   (pure & stable)
========================= */
const hashValue = (text, min, max) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return min + (Math.abs(hash) % (max - min));
};

const Charts = () => {
  /* =========================
     Load APIs
  ========================== */
  const apis = useMemo(() => {
    return JSON.parse(localStorage.getItem("apis")) || [];
  }, []);

  const apiNames = apis.map((api) => api.name);

  /* =========================
     Derived (PURE) Data
  ========================== */
  const requestData = useMemo(
    () => apiNames.map((name) => hashValue(name, 1000, 6000)),
    [apiNames]
  );

  const co2Data = useMemo(
    () => apiNames.map((name) => hashValue(name, 50, 450)),
    [apiNames]
  );

  /* =========================
     Charts
  ========================== */
  const requestsChart = {
    labels: apiNames.length ? apiNames : ["No APIs"],
    datasets: [
      {
        label: "API Requests",
        data: requestData.length ? requestData : [0],
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const co2Chart = {
    labels: apiNames.length ? apiNames : ["No APIs"],
    datasets: [
      {
        data: co2Data.length ? co2Data : [1],
        backgroundColor: [
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#3B82F6",
          "#8B5CF6",
          "#EC4899",
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} g CO₂`,
        },
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            API Requests Overview
          </h3>
          <div className="h-80">
            <Line data={requestsChart} options={options} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            CO₂ Emission by API
          </h3>
          <div className="h-80">
            <Pie data={co2Chart} options={pieOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;