import { FaLeaf, FaTrash, FaBolt, FaEllipsisV } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-right from-green-600 to-emerald-700 sticky top-0 z-50">
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

        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 border border-white/30 rounded-lg text-white">
            <FaTrash className="mr-2" />
            Clear All
          </button>

          <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
            <FaBolt className="text-white mr-2" />
            <span className="text-white font-bold">5 APIs</span>
          </div>

          <button className="sm:hidden text-white">
            <FaEllipsisV />
          </button>
        </div>
      </div>
    </div>
  );
}
