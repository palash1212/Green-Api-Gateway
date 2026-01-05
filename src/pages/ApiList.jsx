import { useState } from "react";
import { FaList, FaTrash, FaExclamationTriangle } from "react-icons/fa";

export default function ApiList() {
  /* =========================
     Initialize from storage
  ========================== */
  const [apis, setApis] = useState(() => {
    return JSON.parse(localStorage.getItem("apis")) || [];
  });

  const [showConfirm, setShowConfirm] = useState(false);

  /* =========================
     Delete all APIs
  ========================== */
  const handleDeleteAll = () => {
    localStorage.removeItem("apis");
    setApis([]);
    setShowConfirm(false);
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <span className="bg-green-100 p-3 rounded-xl mr-3">
          <FaList className="text-green-600" />
        </span>
        API List
      </h2>

      {/* Delete All Button */}
      {apis.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <FaTrash />
            Delete All
          </button>
        </div>
      )}

      {/* API Table */}
      <div className="bg-white shadow rounded-xl p-6">
        {apis.length === 0 ? (
          <p className="text-gray-500">No APIs available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Endpoint</th>
                  <th className="text-left py-3 px-2">Status</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-600 text-xl" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>all APIs</strong>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
