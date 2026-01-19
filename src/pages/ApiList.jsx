// ApiList.jsx

import React, { useState, useEffect } from "react";
import { FaLeaf, FaBolt, FaCloud, FaServer } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

const ApiList = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      const res = await axiosPublic.get("/allApiList");
      setApis(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const methodBadge = (method) => ({
    GET: "bg-blue-100 text-blue-700",
    POST: "bg-green-100 text-green-700",
    PUT: "bg-yellow-100 text-yellow-700",
    PATCH: "bg-purple-100 text-purple-700",
    DELETE: "bg-red-100 text-red-700",
  }[method] || "bg-gray-100 text-gray-700");

  const greenBadge = (status) => {
    if (status === "GREEN") return "bg-green-100 text-green-700";
    if (status.includes("WARNING")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FaServer className="text-green-600" />
        API Sustainability Records
      </h2>

      {apis.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No API analysis data found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-green-50">
              <tr>
                <th className="p-3 text-left">API URL</th>
                <th className="p-3 text-center">Method</th>
                <th className="p-3 text-center">Response Time</th>
                <th className="p-3 text-center">Payload</th>
                <th className="p-3 text-center">Energy</th>
                <th className="p-3 text-center">CO₂</th>
                <th className="p-3 text-center">Green Status</th>
              </tr>
            </thead>

            <tbody>
  {apis.map((api) => (
    <tr key={api._id} className="border-t hover:bg-green-50">

      {/* API URL */}
      <td className="p-3 text-xs font-mono truncate max-w-xs">
        {api.apiUrl}
      </td>

      {/* Method */}
      <td className="p-3 text-center">
        <span
          className={`px-3 py-1 rounded text-xs font-bold ${methodBadge(api.method)}`}
        >
          {api.method}
        </span>
      </td>

      {/* Response Time */}
      <td className="p-3 text-center">
        {api.responseTimeMs} ms
      </td>

      {/* Payload */}
      <td className="p-3 text-center">
        {api.payloadSizeKB} KB
      </td>

      {/* Energy */}
      <td className="p-3 text-center">
        <FaBolt className="inline text-yellow-500 mr-1" />
        {api.energyUsedWh} Wh
      </td>

      {/* CO2 */}
      <td className="p-3 text-center">
        <FaCloud className="inline text-gray-500 mr-1" />
        {api.co2EmissionMg} mg
      </td>

      {/* Green Status */}
      <td className="p-3 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${greenBadge(api.greenStatus)}`}
        >
          <FaLeaf className="inline mr-1" />
          {api.greenStatus}
        </span>
      </td>

    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default ApiList;
