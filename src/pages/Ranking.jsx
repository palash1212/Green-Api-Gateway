import { useMemo } from "react";
import { FaTrophy, FaLeaf, FaFire } from "react-icons/fa";
import EnergyHeavyApi from "../components/EnergyHeavyApi";
import GreenApi from "../components/GreenApi";

export default function Ranking() {
  const apis = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("apis")) || [];
    } catch {
      return [];
    }
  }, []);

  // Sort APIs by energy used (highest first)
  const energyHeavyApis = [...apis]
    .sort((a, b) => (b.energyUsed || 0) - (a.energyUsed || 0))
    .slice(0, 5);

  // Sort APIs by energy used (lowest first) for green APIs
  const greenApis = [...apis]
    .sort((a, b) => (a.energyUsed || 0) - (b.energyUsed || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-2">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaTrophy className="text-green-600" />
        </span>
        Comparison & Ranking
      </h2>

      {apis.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
          <FaLeaf className="text-gray-300 text-4xl mx-auto mb-4" />
          <p>No APIs available for ranking.</p>
          <p className="text-sm mt-2">
            Add APIs in the management section to see rankings.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 5 Energy-Heavy APIs */}
            <EnergyHeavyApi apis={energyHeavyApis} />

            {/* Top 5 Green APIs */}
            <GreenApi apis={greenApis} />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-right from-red-50 to-white p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-2">
                <FaFire className="text-red-500" />
                <div className="text-sm text-gray-600">
                  Most Energy Intensive
                </div>
              </div>
              <div className="font-bold text-lg">
                {energyHeavyApis[0]?.route || "N/A"}
              </div>
              <div className="text-red-600 font-semibold mt-2">
                {energyHeavyApis[0]?.energyUsed?.toLocaleString() || 0} Wh
              </div>
            </div>

            <div className="bg-gradient-to-right from-green-50 to-white p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-2">
                <FaLeaf className="text-green-500" />
                <div className="text-sm text-gray-600">Most Eco-Friendly</div>
              </div>
              <div className="font-bold text-lg">
                {greenApis[0]?.route || "N/A"}
              </div>
              <div className="text-green-600 font-semibold mt-2">
                {greenApis[0]?.energyUsed?.toLocaleString() || 0} Wh
              </div>
            </div>

            <div className="bg-gradient-to-right from-blue-50 to-white p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-2">
                <FaTrophy className="text-blue-500" />
                <div className="text-sm text-gray-600">Total APIs Ranked</div>
              </div>
              <div className="font-bold text-lg">{apis.length} APIs</div>
              <div className="text-blue-600 font-semibold mt-2">
                {energyHeavyApis.length} top performers
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
