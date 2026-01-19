import React, { useState } from "react";
import axios from "axios";

const ApiManagement = () => {
  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeApi = async () => {
    if (!apiUrl) {
      alert("Please enter API URL");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        apiName, // Send API name to backend
        apiUrl,
        method,
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "API analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          🌱 Green API Gateway
        </h1>
        <p className="text-gray-600 mb-6">
          Analyze API Energy Usage & CO₂ Emission
        </p>

        {/* Input Section */}
        <div className="space-y-4">
          {/* API Name Field - Added at the top */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Name (Optional)
            </label>
            <input
              type="text"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              placeholder="e.g., User Management API"
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Give a friendly name to identify this API endpoint
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://jsonplaceholder.typicode.com/users"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={analyzeApi}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Analyzing..." : "Analyze API"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-bold text-green-800 mb-3">
              📊 Analysis Result
            </h2>

            {/* Display API Name in results if available */}
            {result.apiName && (
              <div className="mb-3">
                <strong>API Name:</strong> {result.apiName}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Status Code:</strong> {result.httpStatus}
              </div>

              <div>
                <strong>Response Time:</strong> {result.responseTimeMs} ms
              </div>

              <div>
                <strong>Payload Size:</strong> {result.payloadSizeKB} KB
              </div>

              <div>
                <strong>Transfer Rate:</strong> {result.transferRateMBps} MB/s
              </div>

              <div>
                <strong>Energy Used:</strong> {result.energyUsedWh} Wh
              </div>

              <div>
                <strong>CO₂ Emission:</strong> {result.co2EmissionMg} mg
              </div>

              <div className="col-span-2">
                <strong>Green Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    result.greenStatus === "GREEN"
                      ? "text-green-700"
                      : result.greenStatus.includes("WARNING")
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {result.greenStatus}
                </span>
              </div>
            </div>

            <div className="mt-3 bg-white border rounded p-3 text-sm">
              <strong>Suggestion:</strong> {result.suggestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiManagement;
