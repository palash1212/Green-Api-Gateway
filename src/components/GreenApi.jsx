import { FaLeaf } from "react-icons/fa";

export default function GreenApi({ apis }) {
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-green-100 text-green-700";
      case 1:
        return "bg-green-50 text-green-600";
      case 2:
        return "bg-emerald-50 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Top 5 Green APIs</h3>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          <FaLeaf />
          <span>Eco-Friendly</span>
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
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <FaLeaf />
                <span>Green</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {api.greenScore || "Low"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t text-sm text-gray-500">
        APIs with lowest energy consumption and environmental impact
      </div>
    </div>
  );
}
