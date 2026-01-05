import { useState } from "react";
import { FaChartBar, FaLeaf, FaTrophy } from "react-icons/fa";

export default function Ranking() {
  const [apis] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("apis")) || [];
    return stored.map((api) => ({
      ...api,
      score: Math.floor(Math.random() * 40) + 60, // score between 60–100
    }));
  });

  const rankedApis = [...apis].sort((a, b) => b.score - a.score);

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaChartBar className="text-green-600" />
        </span>
        API Green Ranking
      </h2>

      {rankedApis.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-gray-500">
          No APIs available for ranking.
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Rank</th>
                <th className="text-left py-3 px-2">API Name</th>
                <th className="text-left py-3 px-2">Endpoint</th>
                <th className="text-left py-3 px-2">Green Score</th>
              </tr>
            </thead>
            <tbody>
              {rankedApis.map((api, index) => (
                <tr key={api.id} className="border-b last:border-none">
                  <td className="py-3 px-2 font-semibold">
                    {index === 0 ? (
                      <FaTrophy className="text-yellow-500 inline" />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="py-3 px-2">{api.name}</td>
                  <td className="py-3 px-2 text-blue-600 break-all">
                    {api.url}
                  </td>
                  <td className="py-3 px-2">
                    <span className="flex items-center gap-2">
                      <FaLeaf className="text-green-600" />
                      <span className="font-semibold">{api.score}</span>
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
}
