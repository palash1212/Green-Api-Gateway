import {
  FaLeaf,
  FaBolt,
  FaCloud,
  FaTrophy,
  FaCheckCircle,
} from "react-icons/fa";

export default function GreenApi({ apis }) {
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow";
      default:
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200";
    }
  };

  const getMethodColor = (method) => {
    if (!method) return "bg-gray-100 text-gray-700";

    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "POST":
        return "bg-green-100 text-green-700 border border-green-200";
      case "PUT":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "DELETE":
        return "bg-red-100 text-red-700 border border-red-200";
      case "PATCH":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getGreenScoreBadge = (greenStatus) => {
    if (!greenStatus)
      return "bg-gray-100 text-gray-800 border-2 border-gray-300";

    if (greenStatus === "GREEN") {
      return "bg-green-100 text-green-800 border-2 border-green-300";
    } else if (greenStatus.includes("WARNING")) {
      return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300";
    } else {
      return "bg-red-100 text-red-800 border-2 border-red-300";
    }
  };

  const formatNumber = (num, decimals = 6) => {
    const number = parseFloat(num || 0);
    if (number === 0) return "0";

    if (number < 0.000001) {
      return number.toExponential(3);
    }

    return number.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format CO2 (convert mg to g for display)
  const formatCO2 = (mg) => {
    const number = parseFloat(mg || 0);
    if (number === 0) return "0 mg";

    if (number < 1) {
      return `${number.toFixed(3)} mg`;
    } else if (number < 1000) {
      return `${number.toFixed(2)} mg`;
    } else {
      return `${(number / 1000).toFixed(3)} g`;
    }
  };

  if (!apis || apis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Top 5 Green APIs</h3>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
            <FaLeaf />
            <span>Eco-Friendly</span>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500">
          <FaLeaf className="text-4xl text-gray-300 mx-auto mb-3" />
          <p>No green APIs available for ranking</p>
          <p className="text-sm mt-1">Analyze APIs to see green rankings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Top 5 Green APIs</h3>
          <p className="text-sm text-gray-600 mt-1">
            Most energy-efficient APIs (lowest energy usage)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
          <FaLeaf />
          <span>Eco-Friendly</span>
        </div>
      </div>

      <div className="space-y-4">
        {apis.map((api, index) => {
          const apiName = api.apiName || api.apiUrl?.split("/").pop() || "API";
          const apiUrl = api.apiUrl || "";
          const energyUsedWh = parseFloat(api.energyUsedWh) || 0;
          const co2EmissionMg = parseFloat(api.co2EmissionMg) || 0;
          const responseTimeMs = api.responseTimeMs || 0;
          const greenStatus = api.greenStatus || "GREEN";

          return (
            <div
              key={api._id || api.id || index}
              className="flex items-center justify-between p-4 border border-green-200 rounded-xl hover:bg-green-50 transition-all duration-200"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${getRankBadge(
                    index
                  )}`}
                >
                  {index + 1}
                </div>

                {/* API Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className="font-semibold text-gray-900 truncate"
                      title={apiName}
                    >
                      {apiName}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getMethodColor(
                        api.method
                      )}`}
                    >
                      {api.method || "GET"}
                    </span>
                  </div>

                  {apiUrl && (
                    <p
                      className="text-xs text-gray-500 font-mono truncate"
                      title={apiUrl}
                    >
                      {apiUrl.length > 40
                        ? apiUrl.substring(0, 40) + "..."
                        : apiUrl}
                    </p>
                  )}

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <FaBolt className="text-yellow-500" />
                      <span className="text-gray-700 font-medium">
                        {formatNumber(energyUsedWh)} Wh
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <FaCloud className="text-blue-500" />
                      <span className="text-gray-700 font-medium">
                        {formatCO2(co2EmissionMg)}
                      </span>
                    </div>
                    {responseTimeMs > 0 && (
                      <div className="text-xs text-gray-500">
                        {responseTimeMs} ms
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Green Score */}
              <div className="text-right pl-4">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {index === 0 && <FaTrophy className="text-yellow-500" />}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getGreenScoreBadge(
                      greenStatus
                    )}`}
                  >
                    {greenStatus}
                  </span>
                </div>
                {api.payloadSizeKB && (
                  <div className="text-xs text-gray-500 mt-1">
                    {parseFloat(api.payloadSizeKB).toFixed(2)} KB
                  </div>
                )}
                {api.suggestion && (
                  <div
                    className="text-xs text-gray-500 mt-1 truncate max-w-37.5"
                    title={api.suggestion}
                  >
                    {api.suggestion.split(".")[0]}.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-green-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{apis.length}</span> green APIs ranked
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <FaCheckCircle />
            <span className="font-medium">Excellent sustainability</span>
          </div>
        </div>

        {/* Stats Summary */}
        {apis.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mt-2">
              These APIs have the lowest energy consumption in your system
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-green-100">
              <div className="text-center">
                <div className="text-xs text-gray-500">Avg Energy</div>
                <div className="font-bold text-green-700 text-sm">
                  {formatNumber(
                    apis.reduce(
                      (sum, api) => sum + (parseFloat(api.energyUsedWh) || 0),
                      0
                    ) / apis.length
                  )}{" "}
                  Wh
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Avg CO₂</div>
                <div className="font-bold text-blue-700 text-sm">
                  {formatCO2(
                    apis.reduce(
                      (sum, api) => sum + (parseFloat(api.co2EmissionMg) || 0),
                      0
                    ) / apis.length
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Avg Response</div>
                <div className="font-bold text-purple-700 text-sm">
                  {Math.round(
                    apis.reduce(
                      (sum, api) => sum + (parseFloat(api.responseTimeMs) || 0),
                      0
                    ) / apis.length
                  )}{" "}
                  ms
                </div>
              </div>
            </div>

            {/* Green Status Breakdown */}
            <div className="mt-4 pt-4 border-t border-green-100">
              <div className="text-xs text-gray-500 mb-2">
                Green Status Breakdown:
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (apis.filter((a) => a.greenStatus === "GREEN").length /
                          apis.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {apis.filter((a) => a.greenStatus === "GREEN").length} /{" "}
                  {apis.length} GREEN
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
