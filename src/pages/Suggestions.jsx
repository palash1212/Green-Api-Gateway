import { useState, useEffect } from "react";
import {
  FaLightbulb,
  FaLeaf,
  FaClock,
  FaServer,
  FaBolt,
  FaCloud,
  FaCompressAlt,
  FaDatabase,
  FaNetworkWired,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

export default function Suggestions() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const API_BASE_URL = "http://localhost:5000";

  // Fetch APIs from backend
  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/allApiList`);
      const apiData = response.data || [];
      setApis(apiData);
      generateSuggestions(apiData);
    } catch (error) {
      console.error("Error fetching APIs:", error);
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (apiData) => {
    if (!apiData || apiData.length === 0) {
      setSuggestions([]);
      return;
    }

    const suggestionsList = [];

    // 1. Check for NOT GREEN APIs
    const notGreenApis = apiData.filter(
      (api) => api.greenStatus === "NOT GREEN",
    );
    if (notGreenApis.length > 0) {
      const topApi = notGreenApis[0];
      suggestionsList.push({
        id: 1,
        title: "Optimize Critical APIs",
        icon: FaExclamationTriangle,
        iconColor: "text-red-600",
        bgColor: "bg-red-50",
        description: `${notGreenApis.length} APIs are marked as "NOT GREEN".`,
        details: `Focus on ${topApi.apiName || topApi.apiUrl?.split("/").pop() || "critical APIs"} with ${parseFloat(topApi.energyUsedWh || 0).toFixed(6)} Wh energy usage.`,
        recommendation:
          "Implement pagination, compression, or consider file-based downloads.",
        priority: "high",
      });
    }

    // 2. Check for high energy consumption
    const sortedByEnergy = [...apiData].sort(
      (a, b) =>
        (parseFloat(b.energyUsedWh) || 0) - (parseFloat(a.energyUsedWh) || 0),
    );
    if (
      sortedByEnergy.length > 0 &&
      parseFloat(sortedByEnergy[0].energyUsedWh || 0) > 0.0001
    ) {
      suggestionsList.push({
        id: 2,
        title: "Reduce Energy Consumption",
        icon: FaBolt,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "High energy consumption detected in top APIs.",
        details: `Top energy consumer: ${sortedByEnergy[0].apiName || sortedByEnergy[0].apiUrl?.split("/").pop() || "API"} (${parseFloat(sortedByEnergy[0].energyUsedWh || 0).toFixed(6)} Wh).`,
        recommendation: "Consider response caching and payload optimization.",
        priority: "medium",
      });
    }

    // 3. Check for large payload sizes
    const largePayloadApis = apiData.filter(
      (api) => parseFloat(api.payloadSizeKB || 0) > 100,
    );
    if (largePayloadApis.length > 0) {
      const largest = largePayloadApis.sort(
        (a, b) =>
          (parseFloat(b.payloadSizeKB) || 0) -
          (parseFloat(a.payloadSizeKB) || 0),
      )[0];
      suggestionsList.push({
        id: 3,
        title: "Optimize Payload Size",
        icon: FaCompressAlt,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
        description: `${largePayloadApis.length} APIs have payloads > 100 KB.`,
        details: `Largest payload: ${largest.apiName || largest.apiUrl?.split("/").pop() || "API"} (${parseFloat(largest.payloadSizeKB || 0).toFixed(2)} KB).`,
        recommendation: "Use gzip compression and field filtering.",
        priority: "medium",
      });
    }

    // 4. Check for slow response times
    const slowApis = apiData.filter(
      (api) => parseFloat(api.responseTimeMs || 0) > 500,
    );
    if (slowApis.length > 0) {
      suggestionsList.push({
        id: 4,
        title: "Improve Response Times",
        icon: FaClock,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
        description: `${slowApis.length} APIs have response times > 500ms.`,
        details: "Slow response times increase energy consumption per request.",
        recommendation: "Optimize database queries and implement caching.",
        priority: "medium",
      });
    }

    // 5. General recommendations
    suggestionsList.push({
      id: 5,
      title: "Implement Caching Strategy",
      icon: FaDatabase,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      description: "Reduce server load and energy usage.",
      details: "Cache frequently accessed data at multiple levels.",
      recommendation: "Use Redis/CDN/browser caching based on data volatility.",
      priority: "low",
    });

    suggestionsList.push({
      id: 6,
      title: "Monitor API Health",
      icon: FaChartLine,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Regular monitoring prevents energy inefficiencies.",
      details: "Track energy consumption and CO₂ emissions over time.",
      recommendation: "Set up alerts for sudden energy spikes.",
      priority: "low",
    });

    setSuggestions(suggestionsList);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-600">Loading optimization suggestions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow">
            <FaLightbulb className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Optimization Suggestions
            </h2>
            <p className="text-gray-600">
              AI-powered recommendations to improve API sustainability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm bg-green-50 px-3 py-1 rounded-full text-green-700 border border-green-200">
            {suggestions.length} suggestions
          </div>
          <button
            onClick={fetchApis}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {apis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-10 text-center">
          <FaLightbulb className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No APIs Analyzed
          </h3>
          <p className="text-gray-600 mb-6">
            Analyze APIs first to receive personalized optimization suggestions
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaBolt className="text-yellow-500" />
              <span>Get energy consumption analysis</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaCloud className="text-blue-500" />
              <span>Receive CO₂ emission insights</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaLeaf className="text-green-500" />
              <span>Get green status recommendations</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => (window.location.href = "/api-management")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to API Analyzer
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* API Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              API Analysis Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Total APIs</div>
                <div className="text-2xl font-bold text-gray-800">
                  {apis.length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Green APIs</div>
                <div className="text-2xl font-bold text-green-600">
                  {apis.filter((api) => api.greenStatus === "GREEN").length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Total Energy</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {apis
                    .reduce(
                      (sum, api) => sum + (parseFloat(api.energyUsedWh) || 0),
                      0,
                    )
                    .toFixed(6)}{" "}
                  Wh
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Total CO₂</div>
                <div className="text-2xl font-bold text-blue-600">
                  {apis
                    .reduce(
                      (sum, api) => sum + (parseFloat(api.co2EmissionMg) || 0),
                      0,
                    )
                    .toFixed(2)}{" "}
                  mg
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={suggestion.id}
                  className={`${suggestion.bgColor} rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg bg-white ${suggestion.iconColor}`}
                      >
                        <Icon className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {suggestion.title}
                        </h3>
                        <div className="mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(suggestion.priority)}`}
                          >
                            {suggestion.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-700">{suggestion.description}</p>

                    {suggestion.details && (
                      <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          {suggestion.details}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Recommendation:
                      </div>
                      <p className="text-gray-600">
                        {suggestion.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Tips */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Additional Sustainability Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">Server Location</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Choose data centers in regions with renewable energy sources.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">Load Balancing</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Distribute traffic efficiently to reduce energy spikes.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-medium text-gray-700">Monitoring</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Regular energy audits help identify optimization
                  opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h3 className="font-semibold text-lg text-green-800 mb-4">
              Potential Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">Energy Savings</div>
                <div className="text-lg font-bold text-green-700 mt-1">
                  Up to 40%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  With proper optimization
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">CO₂ Reduction</div>
                <div className="text-lg font-bold text-blue-700 mt-1">
                  Up to 35%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Through green practices
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600">Cost Savings</div>
                <div className="text-lg font-bold text-purple-700 mt-1">
                  $100-500/month
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  For typical deployments
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
