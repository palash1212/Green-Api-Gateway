import { FaFire } from "react-icons/fa";

export default function EnergyHeavyApi({ apis }) {
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-red-100 text-red-700";
      case 1:
        return "bg-orange-100 text-orange-700";
      case 2:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Top 5 Energy-Heavy APIs</h3>
        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          <FaFire />
          <span>High Impact</span>
        </div>
      </div>

      <div className="space-y-4">
        {apis.map((api, index) => (
          <div
            key={api.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getRankColor(
                  index
                )}`}
              >
                {index + 1}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">{api.route}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {api.energyUsed?.toLocaleString() || 0} Wh -{" "}
                  {api.co2?.toLocaleString() || 0} g CO₂
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {api.energyUsed?.toLocaleString() || 0} Wh
              </div>
              <div className="text-sm text-gray-600">
                {api.co2?.toLocaleString() || 0} g CO₂
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t text-sm text-gray-500">
        Based on energy consumption and CO₂ emissions per day
      </div>
    </div>
  );
}
