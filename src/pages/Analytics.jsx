import { useEffect, useRef, useState } from "react";
import { FaChartLine, FaDatabase } from "react-icons/fa";
import Chart from "chart.js/auto";

export default function Analytics() {
  /* =========================
     Load APIs from storage
  ========================== */
  const [apis] = useState(() => {
    return JSON.parse(localStorage.getItem("apis")) || [];
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  /* =========================
     Create chart safely
  ========================== */
  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart (React 18 safe)
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: apis.map((api) => api.name),
        datasets: [
          {
            label: "API Usage Score",
            data: apis.map(() => Math.floor(Math.random() * 100) + 20),
            backgroundColor: "rgba(34, 197, 94, 0.7)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [apis]);

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaChartLine className="text-green-600" />
        </span>
        API Analytics
      </h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center gap-3">
            <FaDatabase className="text-green-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Total APIs</p>
              <h3 className="text-xl font-bold">{apis.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Average Efficiency</p>
          <h3 className="text-xl font-bold">{apis.length ? "78%" : "N/A"}</h3>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Green Score</p>
          <h3 className="text-xl font-bold">{apis.length ? "A+" : "N/A"}</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          API Usage & Sustainability Overview
        </h3>

        {apis.length === 0 ? (
          <p className="text-gray-500">No APIs available for analytics.</p>
        ) : (
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </div>
    </div>
  );
}
