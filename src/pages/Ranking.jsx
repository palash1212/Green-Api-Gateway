import { useMemo } from "react";
import { FaTrophy, FaLeaf } from "react-icons/fa";

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

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || "0";
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Energy-Heavy APIs */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Top 5 Energy-Heavy APIs</h3>
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                High Impact
              </div>
            </div>

            <div className="space-y-4">
              {energyHeavyApis.map((api, index) => (
                <div
                  key={api.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? "bg-red-100 text-red-700"
                          : index === 1
                          ? "bg-orange-100 text-orange-700"
                          : index === 2
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {api.route}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatNumber(api.energyUsed || 0)} Wh -{" "}
                        {formatNumber(api.co2 || 0)} g CO₂
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatNumber(api.energyUsed || 0)} Wh
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(api.co2 || 0)} g CO₂
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              Based on energy consumption and CO₂ emissions per day
            </div>
          </div>

          {/* Top 5 Green APIs */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Top 5 Green APIs</h3>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Eco-Friendly
              </div>
            </div>

            <div className="space-y-4">
              {greenApis.map((api, index) => (
                <div
                  key={api.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? "bg-green-100 text-green-700"
                          : index === 1
                          ? "bg-green-50 text-green-600"
                          : index === 2
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {api.route}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatNumber(api.energyUsed || 0)} Wh -{" "}
                        {formatNumber(api.co2 || 0)} g CO₂
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <FaLeaf />
                      <span>Green</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {api.greenScore || "Low"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              APIs with lowest energy consumption and environmental impact
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {apis.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-right from-red-50 to-white p-6 rounded-xl border">
            <div className="text-sm text-gray-600 mb-2">
              Most Energy Intensive
            </div>
            <div className="font-bold text-lg">
              {energyHeavyApis[0]?.route || "N/A"}
            </div>
            <div className="text-red-600 font-semibold mt-2">
              {formatNumber(energyHeavyApis[0]?.energyUsed || 0)} Wh
            </div>
          </div>

          <div className="bg-gradient-to-right from-green-50 to-white p-6 rounded-xl border">
            <div className="text-sm text-gray-600 mb-2">Most Eco-Friendly</div>
            <div className="font-bold text-lg">
              {greenApis[0]?.route || "N/A"}
            </div>
            <div className="text-green-600 font-semibold mt-2">
              {formatNumber(greenApis[0]?.energyUsed || 0)} Wh
            </div>
          </div>

          <div className="bg-gradient-to-right from-blue-50 to-white p-6 rounded-xl border">
            <div className="text-sm text-gray-600 mb-2">Total APIs Ranked</div>
            <div className="font-bold text-lg">{apis.length} APIs</div>
            <div className="text-blue-600 font-semibold mt-2">
              {energyHeavyApis.length} top performers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
