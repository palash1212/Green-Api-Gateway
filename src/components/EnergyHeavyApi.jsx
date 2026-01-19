import {
  FaFire,
  FaBolt,
  FaCloud,
  FaExclamationTriangle,
  FaArrowUp,
} from "react-icons/fa";

export default function EnergyHeavyApi({ apis }) {
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg";
      case 1:
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow";
      case 2:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow";
      default:
        return "bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border border-red-200";
    }
  };

  const getMethodColor = (method) => {
    if (!method) return "bg-gray-100 text-gray-700 border border-gray-200";

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

  const calculateDailyCost = (energyWh) => {
    // Assuming $0.12 per kWh
    const energyKwh = parseFloat(energyWh || 0) / 1000;
    const dailyCost = energyKwh * 0.12;
    return dailyCost.toFixed(6);
  };

  if (!apis || apis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Top 5 Energy-Heavy APIs
          </h3>
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
            <FaFire />
            <span>High Impact</span>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500">
          <FaFire className="text-4xl text-gray-300 mx-auto mb-3" />
          <p>No energy-heavy APIs available</p>
          <p className="text-sm mt-1">All APIs are performing efficiently</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Top 5 Energy-Heavy APIs
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Highest energy consumption APIs
          </p>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
          <FaFire />
          <span>High Impact</span>
        </div>
      </div>

      <div className="space-y-4">
        {apis.map((api, index) => {
          const apiName = api.apiName || api.apiUrl?.split("/").pop() || "API";
          const apiUrl = api.apiUrl || "";
          const energyUsedWh = parseFloat(api.energyUsedWh) || 0;
          const co2EmissionMg = parseFloat(api.co2EmissionMg) || 0;
          const responseTimeMs = api.responseTimeMs || 0;
          const greenStatus = api.greenStatus || "NOT GREEN";
          const payloadSizeKB = parseFloat(api.payloadSizeKB) || 0;

          return (
            <div
              key={api._id || api.id || index}
              className="flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
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

                  {/* Energy & CO2 Badges */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                      <FaBolt className="text-red-500" />
                      <span className="font-medium">
                        {formatNumber(energyUsedWh)} Wh
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">
                      <FaCloud className="text-orange-500" />
                      <span className="font-medium">
                        {formatCO2(co2EmissionMg)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Scores & Info */}
              <div className="text-right pl-4 min-w-30">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getGreenScoreBadge(
                        greenStatus
                      )}`}
                    >
                      {greenStatus}
                    </span>
                    {index === 0 && (
                      <FaExclamationTriangle className="text-red-500" />
                    )}
                  </div>

                  {/* Daily Cost */}
                  <div className="text-xs font-medium text-gray-700 mt-1">
                    ${calculateDailyCost(energyUsedWh)}/day
                  </div>

                  {/* Performance Info */}
                  <div className="flex items-center gap-2 mt-1">
                    {responseTimeMs > 0 && (
                      <div className="text-xs text-gray-500">
                        {responseTimeMs} ms
                      </div>
                    )}
                    {payloadSizeKB > 0 && (
                      <div className="text-xs text-gray-500">
                        {payloadSizeKB.toFixed(2)} KB
                      </div>
                    )}
                  </div>

                  {api.suggestion && (
                    <div
                      className="text-xs text-red-600 font-medium mt-1 truncate max-w-37.5"
                      title={api.suggestion}
                    >
                      {api.suggestion.split(".")[0]}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-red-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{apis.length}</span> energy-intensive
            APIs
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <FaArrowUp />
            <span className="font-medium">High optimization potential</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These APIs consume the most energy and have the highest environmental
          impact
        </p>

        {/* Stats Summary */}
        {apis.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-red-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">Total Energy</div>
              <div className="font-bold text-red-700 text-sm">
                {formatNumber(
                  apis.reduce(
                    (sum, api) => sum + (parseFloat(api.energyUsedWh) || 0),
                    0
                  )
                )}{" "}
                Wh
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Total CO₂</div>
              <div className="font-bold text-orange-700 text-sm">
                {formatCO2(
                  apis.reduce(
                    (sum, api) => sum + (parseFloat(api.co2EmissionMg) || 0),
                    0
                  )
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Daily Cost</div>
              <div className="font-bold text-gray-800 text-sm">
                $
                {apis
                  .reduce((sum, api) => {
                    const energy = parseFloat(api.energyUsedWh) || 0;
                    const energyKwh = energy / 1000;
                    return sum + energyKwh * 0.12;
                  }, 0)
                  .toFixed(6)}
              </div>
            </div>
          </div>
        )}

        {/* Green Status Breakdown */}
        {apis.length > 0 && (
          <div className="mt-4 pt-4 border-t border-red-100">
            <div className="text-xs text-gray-500 mb-2">Status Breakdown:</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (apis.filter((a) => a.greenStatus === "NOT GREEN")
                        .length /
                        apis.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                {apis.filter((a) => a.greenStatus === "NOT GREEN").length} /{" "}
                {apis.length} NOT GREEN
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tips */}
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-sm text-red-800 font-medium mb-1">
            <FaExclamationTriangle />
            <span>Optimization Recommendations:</span>
          </div>
          <ul className="text-xs text-red-700 space-y-1">
            <li>
              • Reduce payload size (currently{" "}
              {apis[0]?.payloadSizeKB?.toFixed(2) || "unknown"} KB avg)
            </li>
            <li>• Implement response caching strategies</li>
            <li>• Use data compression (gzip, brotli)</li>
            <li>• Optimize database queries and indexes</li>
            <li>• Consider pagination for large responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
