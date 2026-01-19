// ApiList.jsx

import React, { useState, useEffect } from "react";
import { 
  FaLeaf, FaBolt, FaCloud, FaServer,
  FaChartBar, FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";

const ApiList = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
        setApis(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions matching ApiManagement.jsx
  const badge = (score) => {
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

  const methodBadge = (method) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "POST":
        return "bg-green-100 text-green-700 border border-green-300";
      case "PUT":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "DELETE":
        return "bg-red-100 text-red-700 border border-red-300";
      case "PATCH":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getRegionColor = (region) => {
    const intensities = {
      "France": "text-green-700 bg-green-50 border-green-200",
      "USA": "text-blue-700 bg-blue-50 border-blue-200",
      "India": "text-orange-700 bg-orange-50 border-orange-200",
      "South Asia": "text-red-700 bg-red-50 border-red-200",
      "Global Average": "text-gray-700 bg-gray-50 border-gray-200"
    };
    return intensities[region] || "text-gray-700 bg-gray-50 border-gray-200";
  };

  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num || 0);
    if (number === 0) return "0";
    
    if (number < 0.0001) {
      return number.toExponential(4);
    }
    
    if (number < 1) {
      return number.toFixed(decimals + 2);
    }
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const safe = (value) => (value !== undefined && value !== null ? value : 0);

  // Open analytics
  const openAnalytics = (apiId) => {
    navigate(`/analytics/${apiId}`);
  };

  // View API details
  const viewApiDetails = (apiId) => {
    navigate(`/api-details/${apiId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaServer className="text-green-600" />
            API Sustainability Dashboard
          </h2>
          <p className="text-gray-600">
            Monitor energy consumption and CO₂ emissions for each API endpoint
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          Total APIs: <span className="font-bold text-green-600">{apis.length}</span>
        </div>
      </div>

      {apis.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white">
          <FaServer className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No APIs Analyzed Yet</p>
          <p className="text-sm mt-1 text-gray-500">
            Add APIs from the API Management page to see sustainability metrics
          </p>
          <button
            onClick={() => navigate("/api-management")}
            className="mt-6 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            Go to API Management
            <FaArrowRight />
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold">API DETAILS</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">METHOD</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">DAILY REQUESTS</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">AVG PAYLOAD</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">REGION</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">ENERGY USED</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">CO₂ EMISSION</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">GREEN SCORE</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">ANALYTICS</th>
                </tr>
              </thead>

              <tbody>
                {apis.map((api) => (
                  <tr 
                    key={api._id} 
                    className="border-b hover:bg-green-50 transition"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-800">{api.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate max-w-xs">
                          {api.method} {api.endpoint}
                        </p>
                        {api.description && (
                          <p className="text-xs text-gray-500 mt-1">{api.description}</p>
                        )}
                        <button
                          onClick={() => viewApiDetails(api._id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                        >
                          View Details <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${methodBadge(api.method)}`}
                      >
                        {api.method}
                      </span>
                    </td>

                    <td className="p-4 text-center font-medium">
                      <div className="text-lg">{safe(api.dailyRequests).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="font-medium">{formatNumber(api.avgPayload)} KB</div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(api.avgPayload * 1024)} bytes
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded text-xs ${getRegionColor(api.region)}`}>
                        {api.region || "Global Average"}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {api.region === "France" ? "50 g/kWh" : 
                         api.region === "USA" ? "300 g/kWh" :
                         api.region === "India" ? "650 g/kWh" :
                         api.region === "South Asia" ? "550 g/kWh" : "475 g/kWh"}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaBolt className="text-yellow-500 text-sm" />
                          <span className="font-bold text-blue-800">
                            {formatNumber(api.energyUsed)} Wh
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(api.energyUsed / 1000, 4)} kWh
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaCloud className="text-gray-500 text-sm" />
                          <span className="font-bold text-red-800">
                            {formatNumber(api.co2)} g
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(api.co2 * 1000)} mg
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold ${badge(api.greenScore)}`}
                        >
                          <FaLeaf /> {api.greenScore}
                        </span>
                        {api.responseTime && (
                          <div className="text-xs text-gray-500 mt-1">
                            Response: {api.responseTime} ms
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => openAnalytics(api._id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FaChartBar />
                        View Analytics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600">Green APIs</div>
              <div className="text-2xl font-bold text-green-700">
                {apis.filter(a => a.greenScore === "Green").length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-sm text-gray-600">Medium APIs</div>
              <div className="text-2xl font-bold text-yellow-700">
                {apis.filter(a => a.greenScore === "Medium").length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-sm text-gray-600">High APIs</div>
              <div className="text-2xl font-bold text-orange-700">
                {apis.filter(a => a.greenScore === "High").length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-gray-600">Critical APIs</div>
              <div className="text-2xl font-bold text-red-700">
                {apis.filter(a => a.greenScore === "Critical").length}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiList;