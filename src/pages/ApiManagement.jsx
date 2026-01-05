import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaServer } from "react-icons/fa";

export default function ApiManagement() {
  /* =========================
     Initialize from storage
  ========================== */
  const [apis, setApis] = useState(() => {
    return JSON.parse(localStorage.getItem("apis")) || [];
  });

  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  /* =========================
     Persist APIs to storage
  ========================== */
  useEffect(() => {
    localStorage.setItem("apis", JSON.stringify(apis));
  }, [apis]);

  /* =========================
     Add API
  ========================== */
  const handleAddApi = (e) => {
    e.preventDefault();
    if (!apiName.trim() || !apiUrl.trim()) return;

    const newApi = {
      id: Date.now(),
      name: apiName.trim(),
      url: apiUrl.trim(),
      status: "Active",
    };

    setApis((prev) => [...prev, newApi]);
    setApiName("");
    setApiUrl("");
  };

  /* =========================
     Remove Single API
  ========================== */
  const handleRemoveApi = (id) => {
    setApis((prev) => prev.filter((api) => api.id !== id));
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaServer className="text-green-600" />
        </span>
        API Management
      </h2>

      {/* Add API Form */}
      <form
        onSubmit={handleAddApi}
        className="bg-white shadow rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">Add New API</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="API Name"
            value={apiName}
            onChange={(e) => setApiName(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="url"
            placeholder="API Endpoint URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          <FaPlus />
          Add API
        </button>
      </form>

      {/* API Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Registered APIs</h3>

        {apis.length === 0 ? (
          <p className="text-gray-500">No APIs added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Endpoint</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-right py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {apis.map((api) => (
                  <tr key={api.id} className="border-b last:border-none">
                    <td className="py-3 px-2">{api.name}</td>
                    <td className="py-3 px-2 text-blue-600 break-all">
                      {api.url}
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {api.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleRemoveApi(api.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
