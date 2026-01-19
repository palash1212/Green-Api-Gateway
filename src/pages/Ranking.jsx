import { useState, useEffect } from "react";
import { FaTrophy, FaLeaf, FaFire, FaBolt, FaCloud, FaChartBar } from "react-icons/fa";
import EnergyHeavyApi from "../components/EnergyHeavyApi";
import GreenApi from "../components/GreenApi";
import useAxiosPublic from "../hooks/useAxiosPublic";

export default function Ranking() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Fetch APIs from backend
  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get("/apis");
      if (response.data.success) {
        const apiData = response.data.data || [];
        setApis(apiData);
        calculateRankingStats(apiData);
      }
    } catch (error) {
      console.error("Error fetching APIs for ranking:", error);
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRankingStats = (apiData) => {
    if (!apiData || apiData.length === 0) {
      setStats(null);
      return;
    }

    // Sort APIs by energy used (highest first)
    const energyHeavyApis = [...apiData]
      .sort((a, b) => (parseFloat(b.energyUsed) || 0) - (parseFloat(a.energyUsed) || 0))
      .slice(0, 5);

    // Sort APIs by energy used (lowest first) for green APIs
    const greenApis = [...apiData]
      .sort((a, b) => (parseFloat(a.energyUsed) || 0) - (parseFloat(b.energyUsed) || 0))
      .slice(0, 5);

    // Calculate total energy and CO2
    const totalEnergy = apiData.reduce((sum, api) => sum + (parseFloat(api.energyUsed) || 0), 0);
    const totalCO2 = apiData.reduce((sum, api) => sum + (parseFloat(api.co2) || 0), 0);
    const avgResponseTime = apiData.length > 0 
      ? Math.round(apiData.reduce((sum, api) => sum + (parseFloat(api.responseTime) || 150), 0) / apiData.length)
      : 0;

    // Count green APIs
    const greenAPICount = apiData.filter(api => api.greenScore === "Green").length;
    const criticalAPICount = apiData.filter(api => api.greenScore === "Critical").length;

    setStats({
      energyHeavyApis,
      greenApis,
      totalEnergy,
      totalCO2,
      avgResponseTime,
      greenAPICount,
      criticalAPICount,
      totalAPIs: apiData.length
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow">
            <FaTrophy className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">API Sustainability Rankings</h2>
            <p className="text-gray-600">Compare API energy efficiency and environmental impact</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Green</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Energy Heavy</span>
          </div>
        </div>
      </div>

      {apis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-10 text-center">
          <FaChartBar className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No APIs Available for Ranking</h3>
          <p className="text-gray-600 mb-6">
            Add APIs from the API Management page to see sustainability rankings
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaBolt className="text-yellow-500" />
              <span>Track energy consumption per API</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaCloud className="text-blue-500" />
              <span>Monitor CO₂ emissions</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaLeaf className="text-green-500" />
              <span>Identify eco-friendly APIs</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 5 Energy-Heavy APIs */}
            {stats?.energyHeavyApis && stats.energyHeavyApis.length > 0 && (
              <EnergyHeavyApi apis={stats.energyHeavyApis} />
            )}

            {/* Top 5 Green APIs */}
            {stats?.greenApis && stats.greenApis.length > 0 && (
              <GreenApi apis={stats.greenApis} />
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaFire className="text-red-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Most Energy Intensive</div>
                  <div className="font-bold text-lg truncate">
                    {stats?.energyHeavyApis?.[0]?.name || "N/A"}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-800">
                {stats?.energyHeavyApis?.[0]?.energyUsed ? parseFloat(stats.energyHeavyApis[0].energyUsed).toFixed(2) : "0"} Wh
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {stats?.energyHeavyApis?.[0]?.co2 ? parseFloat(stats.energyHeavyApis[0].co2).toFixed(2) : "0"} g CO₂
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaLeaf className="text-green-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Most Eco-Friendly</div>
                  <div className="font-bold text-lg truncate">
                    {stats?.greenApis?.[0]?.name || "N/A"}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {stats?.greenApis?.[0]?.energyUsed ? parseFloat(stats.greenApis[0].energyUsed).toFixed(2) : "0"} Wh
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {stats?.greenApis?.[0]?.greenScore || "Green"} Score
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBolt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Energy Usage</div>
                  <div className="font-bold text-lg">{stats?.totalAPIs || 0} APIs</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {stats?.totalEnergy ? stats.totalEnergy.toFixed(2) : "0"} Wh
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {stats?.greenAPICount || 0} Green APIs
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaCloud className="text-purple-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total CO₂ Impact</div>
                  <div className="font-bold text-lg">{stats?.criticalAPICount || 0} Critical</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {stats?.totalCO2 ? stats.totalCO2.toFixed(2) : "0"} g
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {stats?.avgResponseTime || 0} ms avg response
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border border-green-200">
            <h3 className="font-semibold text-lg text-green-800 mb-4">Ranking Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-gray-700 mb-2">Improvement Opportunities</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Focus on optimizing {stats?.criticalAPICount || 0} critical APIs</li>
                  <li>• Consider data compression for heavy APIs</li>
                  <li>• Implement caching strategies</li>
                  {stats?.energyHeavyApis?.[0] && (
                    <li className="font-medium text-red-600">
                      • {stats.energyHeavyApis[0].name} needs immediate attention
                    </li>
                  )}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-gray-700 mb-2">Best Practices</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Follow patterns from top green APIs</li>
                  <li>• Monitor response times regularly</li>
                  <li>• Consider server location optimization</li>
                  {stats?.greenApis?.[0] && (
                    <li className="font-medium text-green-600">
                      • {stats.greenApis[0].name} sets the green standard
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}