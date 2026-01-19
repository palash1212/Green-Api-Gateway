import { FaFire, FaBolt, FaCloud, FaExclamationTriangle, FaArrowUp } from "react-icons/fa";

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
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-700";
      case "POST":
        return "bg-green-100 text-green-700";
      case "PUT":
        return "bg-yellow-100 text-yellow-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getGreenScoreBadge = (score) => {
    switch (score) {
      case "Green":
        return "bg-green-100 text-green-800 border-2 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300";
      case "High":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300";
      case "Critical":
        return "bg-red-100 text-red-800 border-2 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-2 border-gray-300";
    }
  };

  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num || 0);
    if (number === 0) return "0";
    
    if (number < 0.001) {
      return number.toExponential(3);
    }
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const calculateDailyCost = (energyWh) => {
    // Assuming $0.12 per kWh
    const energyKwh = parseFloat(energyWh) / 1000;
    const dailyCost = energyKwh * 0.12;
    return dailyCost.toFixed(4);
  };

  if (!apis || apis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Top 5 Energy-Heavy APIs</h3>
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
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
          <h3 className="text-xl font-bold text-gray-800">Top 5 Energy-Heavy APIs</h3>
          <p className="text-sm text-gray-600 mt-1">Highest energy consumption APIs</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          <FaFire />
          <span>High Impact</span>
        </div>
      </div>

      <div className="space-y-4">
        {apis.map((api, index) => (
          <div
            key={api._id || api.id}
            className="flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1">
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
                  <h4 className="font-semibold text-gray-900 truncate">{api.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getMethodColor(api.method)}`}>
                    {api.method}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 font-mono truncate">
                  {api.endpoint || api.route}
                </p>
                
                {/* Energy & CO2 Badges */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                    <FaBolt className="text-red-500" />
                    <span className="font-medium">
                      {formatNumber(api.energyUsed)} Wh
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                    <FaCloud className="text-orange-500" />
                    <span className="font-medium">
                      {formatNumber(api.co2)} g CO₂
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Scores & Info */}
            <div className="text-right pl-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGreenScoreBadge(api.greenScore)}`}>
                    {api.greenScore || "Critical"}
                  </span>
                  {index === 0 && <FaExclamationTriangle className="text-red-500" />}
                </div>
                
                {/* Daily Cost */}
                <div className="text-xs font-medium text-gray-700 mt-1">
                  ${calculateDailyCost(api.energyUsed)}/day
                </div>
                
                {/* Performance Info */}
                <div className="flex items-center gap-2 mt-1">
                  {api.dailyRequests && (
                    <div className="text-xs text-gray-500">
                      {api.dailyRequests.toLocaleString()} req/day
                    </div>
                  )}
                  {api.responseTime && (
                    <div className="text-xs text-gray-500">
                      {api.responseTime} ms
                    </div>
                  )}
                </div>
                
                {api.region && (
                  <div className="text-xs text-gray-500 mt-1">
                    {api.region}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-red-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{apis.length}</span> energy-intensive APIs
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <FaArrowUp />
            <span className="font-medium">High optimization potential</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These APIs consume the most energy and have the highest environmental impact
        </p>
        
        {/* Stats Summary */}
        {apis.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-red-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">Total Energy</div>
              <div className="font-bold text-red-700">
                {formatNumber(apis.reduce((sum, api) => sum + (parseFloat(api.energyUsed) || 0), 0))} Wh
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Total CO₂</div>
              <div className="font-bold text-orange-700">
                {formatNumber(apis.reduce((sum, api) => sum + (parseFloat(api.co2) || 0), 0))} g
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Daily Cost</div>
              <div className="font-bold text-gray-800">
                ${apis.reduce((sum, api) => sum + parseFloat(calculateDailyCost(api.energyUsed)), 0).toFixed(4)}
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
            <li>• Implement response caching</li>
            <li>• Consider data compression</li>
            <li>• Optimize database queries</li>
            <li>• Review payload size</li>
          </ul>
        </div>
      </div>
    </div>
  );
}