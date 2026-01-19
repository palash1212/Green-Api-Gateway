// DashboardCards.jsx
import React from "react";
import {
  HiOutlineArrowPath,
  HiOutlineCircleStack,
  HiOutlineBolt,
  HiOutlineCloud,
  HiOutlineClock,
  HiOutlineServer,
} from "react-icons/hi2";
import MetricCard from "./MetricCard"; // Make sure this is correct path

export default function DashboardCards({ stats }) {
  // Safe access with defaults
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use safe defaults for all values
  const todayRequests = stats.todayRequests || 0;
  const weekRequests = stats.weekRequests || 0;
  const dataTransferredGB = stats.dataTransferredGB || "0.00";
  const energyUsedWh = stats.energyUsedWh || "0.000000";
  const energyKwh = stats.energyKwh || "0.000000";
  const co2EmissionMg = stats.co2EmissionMg || "0.00";
  const co2EmissionG = stats.co2EmissionG || "0.00";
  const treesNeeded = stats.treesNeeded || "0";
  const avgResponseTime = stats.avgResponseTime || 0;
  const greenAPICount = stats.greenAPICount || 0;
  const totalAPIs = stats.totalAPIs || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <MetricCard
        title="Total APIs"
        mainValue={totalAPIs.toString()}
        description={`${greenAPICount} Green APIs`}
        icon={HiOutlineServer}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <MetricCard
        title="Data Transferred"
        mainValue={dataTransferredGB}
        subValue="GB"
        description="Daily estimate"
        icon={HiOutlineCircleStack}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />

      <MetricCard
        title="Energy Used"
        mainValue={energyUsedWh}
        subValue="Wh"
        description={`≈ ${energyKwh} kWh`}
        icon={HiOutlineBolt}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
      />

      <MetricCard
        title="CO₂ Emission"
        mainValue={co2EmissionMg}
        subValue="mg"
        description={`≈ ${co2EmissionG} g • ${treesNeeded} trees`}
        icon={HiOutlineCloud}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

      <MetricCard
        title="Avg Response Time"
        mainValue={avgResponseTime.toString()}
        subValue="ms"
        description="Performance metric"
        icon={HiOutlineClock}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
}
