import { FaTachometerAlt } from "react-icons/fa";
import Charts from "../components/Charts";

export default function Dashboard() {
  return (
    <>
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaTachometerAlt className="text-green-600" />
        </span>
        System Health & Sustainability Snapshot
      </h2>

      {/* Metric cards stay EXACTLY SAME (JSX version) */}

      <Charts />
    </>
  );
}
