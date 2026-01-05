import React, { useMemo, useState } from "react";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";

const ApiManagement = () => {
  const [form, setForm] = useState({
    name: "",
    route: "",
    method: "GET",
    avgPayload: "",
    dailyRequests: "",
    responseTime: "",
    description: "",
  });

  const [selected, setSelected] = useState([]);

  const apis = useMemo(
    () => JSON.parse(localStorage.getItem("apis")) || [],
    []
  );

  /* ---------- helpers ---------- */
  const calcEnergy = (payload, requests) =>
    Math.round(payload * requests * 0.015);

  const calcGreenScore = (energy) => {
    if (energy < 300) return "Low";
    if (energy < 700) return "Medium";
    return "High";
  };

  const badge = (score) =>
    score === "Low"
      ? "bg-green-100 text-green-700"
      : score === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  /* ---------- form handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const clearForm = () =>
    setForm({
      name: "",
      route: "",
      method: "GET",
      avgPayload: "",
      dailyRequests: "",
      responseTime: "",
      description: "",
    });

  const addApi = () => {
    if (!form.name || !form.route) return alert("Required fields missing");

    const energyUsed = calcEnergy(
      Number(form.avgPayload),
      Number(form.dailyRequests)
    );

    const api = {
      id: Date.now().toString(),
      ...form,
      avgPayload: Number(form.avgPayload),
      dailyRequests: Number(form.dailyRequests),
      responseTime: Number(form.responseTime),
      energyUsed,
      co2: Math.round(energyUsed * 0.42),
      greenScore: calcGreenScore(energyUsed),
    };

    localStorage.setItem("apis", JSON.stringify([...apis, api]));
    window.location.reload();
  };

  /* ---------- remove ---------- */
  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((i) => i !== id) : [...s, id]
    );

  const removeSelected = () => {
    if (!selected.length) return;
    localStorage.setItem(
      "apis",
      JSON.stringify(apis.filter((a) => !selected.includes(a.id)))
    );
    window.location.reload();
  };

  const removeAll = () => {
    if (!window.confirm("This action cannot be undone")) return;
    localStorage.removeItem("apis");
    window.location.reload();
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-green-100 rounded-lg">
          <FaCog className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">API Management</h1>
          <p className="text-gray-500">
            Add new APIs to monitor or remove existing ones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADD API */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="bg-green-100 p-2 rounded-lg">
              <FaPlus className="text-green-600" />
            </span>
            Add New API to Monitor
          </h3>

          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="API Name"
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              name="route"
              value={form.route}
              onChange={handleChange}
              placeholder="API Endpoint"
              className="w-full border rounded-lg px-4 py-2"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                name="avgPayload"
                value={form.avgPayload}
                onChange={handleChange}
                placeholder="Avg Payload (KB)"
                className="border rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="dailyRequests"
                value={form.dailyRequests}
                onChange={handleChange}
                placeholder="Daily Requests"
                className="border rounded-lg px-4 py-2"
              />
              <input
                name="responseTime"
                value={form.responseTime}
                onChange={handleChange}
                placeholder="Response Time (ms)"
                className="border rounded-lg px-4 py-2"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description"
              className="border rounded-lg px-4 py-2 h-24 w-full"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={clearForm}
                className="px-4 py-2 border rounded-lg"
              >
                Clear Form
              </button>
              <button
                onClick={addApi}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                + Add API
              </button>
            </div>
          </div>
        </div>

        {/* REMOVE API */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="bg-red-100 p-2 rounded-lg">
              <FaTrash className="text-red-600" />
            </span>
            Remove APIs
          </h3>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {apis.map((api) => (
              <label
                key={api.id}
                className="flex justify-between items-center px-4 py-3 border-b last:border-none"
              >
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleSelect(api.id)}
                  />
                  <div>
                    <p className="font-medium">{api.route}</p>
                    <p className="text-xs text-gray-500">{api.name}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${badge(
                    api.greenScore
                  )}`}
                >
                  {api.greenScore}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-3">
            <span>{selected.length} APIs selected</span>
          </div>

          <button
            onClick={removeSelected}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
          >
            Remove Selected APIs
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Danger Zone: This action cannot be undone
          </p>

          <button
            onClick={removeAll}
            className="mt-2 w-full border border-red-400 text-red-600 py-2 rounded-lg"
          >
            Remove All APIs
          </button>
        </div>
      </div>
    </>
  );
};

export default ApiManagement;
