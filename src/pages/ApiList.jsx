import React, { useMemo } from "react";
import { FaLeaf, FaTrash } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

const ApiList = () => {
  const apis = useMemo(
    () => JSON.parse(localStorage.getItem("apis")) || [],
    []
  );

  const badge = (score) =>
    score === "Low"
      ? "bg-green-100 text-green-700"
      : score === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const methodBadge = (m) =>
    m === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700";

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        Monitor energy consumption and CO₂ emissions for each API endpoint
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="p-3 text-left">API ROUTE / URL</th>
              <th className="p-3">METHOD</th>
              <th className="p-3">REQUESTS</th>
              <th className="p-3">AVG PAYLOAD</th>
              <th className="p-3">ENERGY USED</th>
              <th className="p-3">CO₂ EMISSION</th>
              <th className="p-3">GREEN SCORE</th>
              <th className="p-3 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {apis.map((api) => (
              <tr key={api.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-semibold">{api.route}</p>
                  <p className="text-xs text-gray-500">{api.name}</p>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${methodBadge(
                      api.method
                    )}`}
                  >
                    {api.method}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {api.dailyRequests.toLocaleString()}
                </td>
                <td className="p-3 text-center">{api.avgPayload} KB</td>
                <td className="p-3 text-center">{api.energyUsed} Wh</td>
                <td className="p-3 text-center">{api.co2} g</td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${badge(
                      api.greenScore
                    )}`}
                  >
                    <FaLeaf /> {api.greenScore}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-4">
                    <FaTrash className="text-red-500 cursor-pointer" />
                    <HiOutlineChartBar className="text-blue-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!apis.length && (
          <p className="text-center py-8 text-gray-500">No APIs added yet</p>
        )}
      </div>
    </div>
  );
};

export default ApiList;
