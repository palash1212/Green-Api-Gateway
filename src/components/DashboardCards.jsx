import {
  HiOutlineArrowPath,
  HiOutlineCircleStack,
  HiOutlineBolt,
  HiOutlineCloud,
  HiOutlineClock,
} from "react-icons/hi2";
import MetricCard from "./MetricCard";

export default function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <MetricCard
        title="Total API Requests"
        mainValue={stats.todayRequests.toLocaleString()}
        subValue={`/ ${stats.weekRequests.toLocaleString()}`}
        description="Today / This Week"
        icon={HiOutlineArrowPath}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <MetricCard
        title="Data Transferred"
        mainValue={stats.dataTransferredGB}
        subValue="GB"
        description={`Today: ${stats.todayDataMB} MB`}
        icon={HiOutlineCircleStack}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />

      <MetricCard
        title="Energy Used"
        mainValue={stats.energyUsedWh.toLocaleString()}
        description={`≈ ${stats.energyKwh} kWh`}
        icon={HiOutlineBolt}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
      />

      <MetricCard
        title="CO₂ Emission"
        mainValue={stats.co2Emission.toLocaleString()}
        description={`≈ ${stats.treesNeeded} Trees needed`}
        icon={HiOutlineCloud}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

      <MetricCard
        title="Avg Response Time"
        mainValue={stats.avgResponseTime}
        subValue="ms"
        description="-12% from last week"
        icon={HiOutlineClock}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
}
