// ApiList.jsx

import React, { useState, useEffect } from "react";
import {
  FaLeaf,
  FaBolt,
  FaCloud,
  FaServer,
  FaTrash,
  FaCopy,
} from "react-icons/fa";
import axios from "axios";

const ApiList = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/allApiList`);
      setApis(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch API list. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this API analysis?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteApi/${id}`);

      if (response.data.success) {
        setApis((prevApis) => prevApis.filter((api) => api._id !== id));
        alert(response.data.message || "API analysis deleted successfully!");
      } else {
        alert(response.data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error details:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to delete API analysis";
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedId(url);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const methodBadge = (method) => {
    const styles = {
      GET: "bg-blue-100 text-blue-700 border border-blue-200",
      POST: "bg-green-100 text-green-700 border border-green-200",
      PUT: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      PATCH: "bg-purple-100 text-purple-700 border border-purple-200",
      DELETE: "bg-red-100 text-red-700 border border-red-200",
    };
    return styles[method] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const greenBadge = (status) => {
    if (status === "GREEN")
      return "bg-green-100 text-green-700 border border-green-200";
    if (status && status.includes("WARNING"))
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    return "bg-red-100 text-red-700 border border-red-200";
  };

  const truncateUrl = (url, maxLength = 80) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading API records...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <FaServer className="text-green-600" />
          API Sustainability Records
        </h2>
        {apis.length > 0 && (
          <div className="text-sm bg-green-50 px-3 py-1 rounded-full text-green-700 border border-green-200">
            {apis.length} record{apis.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>

      {apis.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FaServer className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No API analysis data found.</p>
          <p className="text-gray-400 text-sm mt-1">
            Analyze some APIs to see records here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm" style={{ tableLayout: "auto" }}>
            <thead className="bg-green-50">
              <tr>
                <th className="p-3 text-left text-gray-700 font-semibold min-w-75">
                  API Endpoint
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-25">
                  Method
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-30">
                  Response Time
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-25">
                  Payload
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-30">
                  Energy
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-30">
                  CO₂
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-35">
                  Status
                </th>
                <th className="p-3 text-center text-gray-700 font-semibold min-w-30">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {apis.map((api) => (
                <tr
                  key={api._id}
                  className="border-t border-gray-100 hover:bg-green-50 transition-colors"
                >
                  {/* API URL - Full display with copy button */}
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded border border-gray-200">
                            {api.apiUrl}
                          </div>
                          {api.apiName && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <span className="font-medium mr-1">Name:</span>
                              {api.apiName}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleCopyUrl(api.apiUrl)}
                          className="ml-2 p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={
                            copiedId === api.apiUrl ? "Copied!" : "Copy URL"
                          }
                        >
                          {copiedId === api.apiUrl ? (
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <FaCopy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(api.createdAt).toLocaleDateString()} at{" "}
                        {new Date(api.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>

                  {/* Method */}
                  <td className="p-3 text-center align-top">
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${methodBadge(
                        api.method
                      )}`}
                    >
                      {api.method}
                    </span>
                  </td>

                  {/* Response Time */}
                  <td className="p-3 text-center align-top">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        {api.responseTimeMs} ms
                      </span>
                      <div
                        className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                          api.responseTimeMs < 100
                            ? "bg-green-100 text-green-700"
                            : api.responseTimeMs < 500
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {api.responseTimeMs < 100
                          ? "Fast"
                          : api.responseTimeMs < 500
                          ? "Moderate"
                          : "Slow"}
                      </div>
                    </div>
                  </td>

                  {/* Payload */}
                  <td className="p-3 text-center align-top">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        {api.payloadSizeKB?.toFixed(2) || "0.00"} KB
                      </span>
                      <span className="text-xs text-gray-500">
                        ({api.payloadSizeMB?.toFixed(3) || "0.000"} MB)
                      </span>
                    </div>
                  </td>

                  {/* Energy */}
                  <td className="p-3 text-center align-top">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <FaBolt className="text-yellow-500 mr-1" />
                        <span className="font-medium">
                          {api.energyUsedWh?.toFixed(6) || "0.000000"} Wh
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(api.energyUsedWh * 1000)?.toFixed(3) || "0.000"} mWh
                      </div>
                    </div>
                  </td>

                  {/* CO2 */}
                  <td className="p-3 text-center align-top">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <FaCloud className="text-gray-500 mr-1" />
                        <span className="font-medium">
                          {api.co2EmissionMg?.toFixed(2) || "0.00"} mg
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(api.co2EmissionMg / 1000)?.toFixed(4) || "0.0000"} g
                      </div>
                    </div>
                  </td>

                  {/* Green Status */}
                  <td className="p-3 text-center align-top">
                    <div className="flex flex-col items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${greenBadge(
                          api.greenStatus
                        )} mb-1`}
                      >
                        <FaLeaf className="mr-1" />
                        {api.greenStatus}
                      </span>
                      <div className="text-xs text-gray-600 max-w-30">
                        {api.suggestion?.split(".")[0]}.
                      </div>
                    </div>
                  </td>

                  {/* Delete Button */}
                  <td className="p-3 text-center align-top">
                    <button
                      onClick={() => handleDelete(api._id)}
                      disabled={deletingId === api._id}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center
                        ${
                          deletingId === api._id
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
                        }
                      `}
                      title="Delete this record"
                    >
                      {deletingId === api._id ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                          <span className="text-xs">Deleting</span>
                        </>
                      ) : (
                        <>
                          <FaTrash className="text-sm mr-2" />
                          <span className="text-xs">Delete</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary and Refresh */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          <div className="mb-1">
            <span className="font-medium">Total Energy:</span>{" "}
            {apis
              .reduce((sum, api) => sum + (api.energyUsedWh || 0), 0)
              .toFixed(6)}{" "}
            Wh
          </div>
          <div>
            <span className="font-medium">Total CO₂:</span>{" "}
            {apis
              .reduce((sum, api) => sum + (api.co2EmissionMg || 0), 0)
              .toFixed(2)}{" "}
            mg
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            Scroll Top
          </button>
          <button
            onClick={fetchApis}
            className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiList;
