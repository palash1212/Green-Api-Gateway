import { useState } from "react";
import { FaLightbulb, FaLeaf, FaClock, FaServer } from "react-icons/fa";

export default function Suggestions() {
  const [apis] = useState(() => {
    return JSON.parse(localStorage.getItem("apis")) || [];
  });

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaLightbulb className="text-green-600" />
        </span>
        Optimization Suggestions
      </h2>

      {apis.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-gray-500">
          No APIs available. Add APIs to receive optimization suggestions.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Suggestion 1 */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaClock className="text-green-600 text-xl" />
              <h3 className="font-semibold text-lg">Reduce Idle Requests</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Some APIs appear underutilized. Consider batching requests or
              disabling unused endpoints to reduce energy consumption.
            </p>
          </div>

          {/* Suggestion 2 */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaServer className="text-green-600 text-xl" />
              <h3 className="font-semibold text-lg">Enable Caching</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Implement caching strategies (Redis, CDN, browser cache) to reduce
              repetitive API calls and server load.
            </p>
          </div>

          {/* Suggestion 3 */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaLeaf className="text-green-600 text-xl" />
              <h3 className="font-semibold text-lg">Optimize Response Size</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Compress responses (GZIP/Brotli) and remove unnecessary fields to
              lower bandwidth and carbon footprint.
            </p>
          </div>

          {/* Suggestion 4 */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaLightbulb className="text-green-600 text-xl" />
              <h3 className="font-semibold text-lg">Use Green Hosting</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Consider deploying APIs on green-energy-powered data centers for
              improved sustainability ranking.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
