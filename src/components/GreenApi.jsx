import { FaLeaf, FaBolt, FaCloud, FaTrophy, FaCheckCircle } from "react-icons/fa";

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

  if (!apis || apis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Top 5 Green APIs</h3>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            <FaLeaf />
            <span>Eco-Friendly</span>
          </div>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <FaLeaf className="text-4xl text-gray-300 mx-auto mb-3" />
          <p>No green APIs available for ranking</p>
          <p className="text-sm mt-1">Add more APIs to see green rankings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Top 5 Green APIs</h3>
          <p className="text-sm text-gray-600 mt-1">Most energy-efficient APIs</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          <FaLeaf />
          <span>Eco-Friendly</span>
        </div>
      </div>

      <div className="space-y-4">
        {apis.map((api, index) => (
          <div
            key={api._id || api.id}
            className="flex items-center justify-between p-4 border border-green-200 rounded-xl hover:bg-green-50 transition-all duration-200"
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
                
                {/* Metrics */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <FaBolt className="text-yellow-500" />
                    <span className="text-gray-700 font-medium">
                      {formatNumber(api.energyUsed)} Wh
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <FaCloud className="text-blue-500" />
                    <span className="text-gray-700 font-medium">
                      {formatNumber(api.co2)} g CO₂
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Score */}
            <div className="text-right pl-4">
              <div className="flex items-center gap-2 justify-end mb-1">
                {index === 0 && <FaTrophy className="text-yellow-500" />}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGreenScoreBadge(api.greenScore)}`}>
                  {api.greenScore || "Green"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {api.responseTime ? `${api.responseTime} ms` : "Fast"}
              </div>
              {api.region && (
                <div className="text-xs text-gray-500 mt-1">
                  {api.region}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-green-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{apis.length}</span> eco-friendly APIs
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <FaCheckCircle />
            <span className="font-medium">Low environmental impact</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These APIs demonstrate best practices in energy efficiency and sustainability
        </p>
        
        {/* Stats Summary */}
        {apis.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-green-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">Total Energy</div>
              <div className="font-bold text-green-700">
                {formatNumber(apis.reduce((sum, api) => sum + (parseFloat(api.energyUsed) || 0), 0))} Wh
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Avg CO₂</div>
              <div className="font-bold text-blue-700">
                {formatNumber(apis.reduce((sum, api) => sum + (parseFloat(api.co2) || 0), 0) / apis.length, 3)} g
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}