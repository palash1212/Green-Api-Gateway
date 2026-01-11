// Analytics.jsx

import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import Chart from "chart.js/auto";

export default function Analytics() {
  const { apiId } = useParams(); // undefined when opened from Navbar

  const apis = JSON.parse(localStorage.getItem("apis")) || [];
  const selectedApi = apis.find((api) => String(api.id) === apiId);

  const reqRef = useRef(null);
  const resRef = useRef(null);
  const payloadRef = useRef(null);
  const energyRef = useRef(null);
  const charts = useRef([]);

  /* ---------- Create Charts ---------- */
  useEffect(() => {
    if (!selectedApi) return;

    charts.current.forEach((c) => c.destroy());
    charts.current = [];

    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const trend = (base) =>
      weeks.map((_, i) => Math.round(base * (0.8 + i * 0.1)));

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutQuart" },
    };

    charts.current.push(
      new Chart(reqRef.current, {
        type: "line",
        data: {
          labels: weeks,
          datasets: [
            {
              label: "Request Count",
              data: trend(selectedApi.dailyRequests || 1000),
              borderColor: "#3B82F6",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options,
      })
    );

    charts.current.push(
      new Chart(resRef.current, {
        type: "line",
        data: {
          labels: weeks,
          datasets: [
            {
              label: "Response Time (ms)",
              data: trend(selectedApi.responseTime || 150),
              borderColor: "#10B981",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options,
      })
    );

    charts.current.push(
      new Chart(payloadRef.current, {
        type: "bar",
        data: {
          labels: ["Min", "25%", "Median", "75%", "Max"],
          datasets: [
            {
              label: "Payload Size (KB)",
              data: [
                selectedApi.avgPayload * 0.6,
                selectedApi.avgPayload * 0.8,
                selectedApi.avgPayload,
                selectedApi.avgPayload * 1.2,
                selectedApi.avgPayload * 1.4,
              ],
              backgroundColor: "#8B5CF6",
            },
          ],
        },
        options,
      })
    );

    charts.current.push(
      new Chart(energyRef.current, {
        type: "line",
        data: {
          labels: weeks,
          datasets: [
            {
              label: "Energy Usage (Wh)",
              data: trend(selectedApi.energyUsed || 300),
              borderColor: "#F59E0B",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options,
      })
    );

    return () => charts.current.forEach((c) => c.destroy());
  }, [selectedApi]);

  /* ---------- CASE 1: Opened from Navbar ---------- */
  if (!apiId) {
    return (
      <div className="bg-white p-10 rounded-xl shadow text-center text-gray-600">
        <h3 className="text-lg font-semibold mb-2">
          Select an API for Detailed Analysis
        </h3>
        <p>
          Click on any API in the API List section to view detailed analytics.
        </p>
      </div>
    );
  }

  /* ---------- CASE 2: Invalid API ID ---------- */
  if (!selectedApi) {
    return (
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <p className="text-red-500 mb-4">API not found</p>
        <Link to="/api-list" className="text-blue-600 underline">
          Back to API List
        </Link>
      </div>
    );
  }

  /* ---------- CASE 3: Valid API ---------- */
  return (
    <div>
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/api-list" className="hover:underline">
          API List
        </Link>{" "}
        / Analytics
      </p>

      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaChartLine className="text-green-600" />
        </span>
        API Analytics
      </h2>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold">{selectedApi.name}</h3>
        <p className="text-gray-500">{selectedApi.route}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow h-72">
          <canvas ref={reqRef} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-72">
          <canvas ref={resRef} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-72">
          <canvas ref={payloadRef} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-72">
          <canvas ref={energyRef} />
        </div>
      </div>
    </div>
  );
}
