import React, { useState } from "react";

const Calculator = () => {
  const [dataGB, setDataGB] = useState(2.5);
  const [region, setRegion] = useState("550");
  const [pue, setPue] = useState(1.2);
  const [results, setResults] = useState(null);

  const calculateImpact = () => {
    const emissionFactor = parseFloat(region);
    const data = parseFloat(dataGB);

    if (!data || data <= 0) {
      alert("Please enter a valid data amount");
      return;
    }

    // Calculations
    const energyWh = data * 1.8 * pue;
    const energyKWh = energyWh / 1000;
    const co2g = energyKWh * emissionFactor;

    // Equivalent comparisons
    let equivalent = "";
    if (co2g < 10) {
      equivalent = "Charging a smartphone for 2 hours";
    } else if (co2g < 50) {
      equivalent = "Watching 1 hour of streaming video";
    } else if (co2g < 100) {
      equivalent = "Driving 0.5 km in a car";
    } else if (co2g < 500) {
      equivalent = `Driving ${(co2g / 200).toFixed(1)} km in a car`;
    } else {
      equivalent = `Equivalent to ${(co2g / 1000).toFixed(2)} kg of CO₂`;
    }

    setResults({
      energy: energyWh.toFixed(2),
      co2: co2g.toFixed(2),
      equivalent,
    });
  };

  return (
    <section id="calculator" className="mb-16 fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Energy & CO₂ Calculator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Calculation Formula
          </h3>

          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">
                Step 1: Bytes to GB
              </h4>
              <p className="text-gray-700">
                Data (GB) = Total Bytes / 1,073,741,824
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">
                Step 2: GB to Energy (Wh)
              </h4>
              <p className="text-gray-700">
                Energy (Wh) = Data (GB) × 1.8 (Wh/GB) × PUE (1.2)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Where PUE (Power Usage Effectiveness) typically ranges from 1.1
                to 1.5
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">
                Step 3: Energy to CO₂ (g)
              </h4>
              <p className="text-gray-700">
                CO₂ (g) = Energy (kWh) × Grid Emission Factor (g CO₂/kWh)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Grid intensity varies by region (e.g., 475 g/kWh for US, 650
                g/kWh for Asia)
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">
              Current Grid Intensity Used
            </h4>
            <p className="text-gray-700">
              Detected Region:{" "}
              <span className="font-semibold">South Asia (Bangladesh)</span>
            </p>
            <p className="text-gray-700">
              Emission Factor:{" "}
              <span className="font-semibold">550 g CO₂/kWh</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Based on Rahman & Mallick (2020) for Bangladesh electricity
              generation
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Calculate Your API Impact
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total Data Transferred (GB)
              </label>
              <input
                type="number"
                value={dataGB}
                onChange={(e) => setDataGB(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 2.5"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Region / Data Center
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="475">US East (475 g/kWh)</option>
                <option value="350">EU West (350 g/kWh)</option>
                <option value="550">South Asia (550 g/kWh)</option>
                <option value="650">Asia Pacific (650 g/kWh)</option>
                <option value="100">Nordic (100 g/kWh - Renewable)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                PUE (Power Usage Effectiveness)
              </label>
              <input
                type="range"
                value={pue}
                onChange={(e) => setPue(parseFloat(e.target.value))}
                className="w-full"
                min="1.1"
                max="1.8"
                step="0.1"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1.1 (Efficient)</span>
                <span className="font-bold">{pue}</span>
                <span>1.8 (Inefficient)</span>
              </div>
            </div>

            <button
              onClick={calculateImpact}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-lg transition"
            >
              Calculate Environmental Impact
            </button>

            {results && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-xl text-gray-800 mb-4">
                  Calculation Results
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Energy Consumption</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {results.energy} Wh
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">CO₂ Emission</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {results.co2} g
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">Equivalent To</p>
                  <p className="text-gray-800">{results.equivalent}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
