import { FaLeaf, FaTrash, FaBolt, FaEllipsisV } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-right from-green-600 to-emerald-700 relative top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-lg">
            <FaLeaf className="text-green-600 text-xl" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-green-600">
              Green API Gateway
            </h1>
            <p className="text-xs text-green-500">Sustainable API Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}
