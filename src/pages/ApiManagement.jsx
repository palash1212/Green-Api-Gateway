import React, { useState, useEffect } from "react";
import { 
  FaCog, FaPlus, FaTrash, FaSpinner, FaCalculator, 
  FaGlobe, FaServer, FaBolt, FaCloud, FaLeaf,
  FaChartBar, FaInfoCircle, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

const ApiManagement = () => {
  const axiosPublic = useAxiosPublic();
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    endpoint: "https://jsonplaceholder.typicode.com/users/1",
    method: "GET",
    requestBody: "",
    headers: "",
  });

  // Configuration from slide
  const [config, setConfig] = useState({
    region: "USA",
    dailyRequests: "1000",
    energyPerGB: "0.81"
  });

  const [selected, setSelected] = useState([]);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);

  // Fetch APIs on component mount
  useEffect(() => {
    fetchApis();
    fetchDashboardStats();
  }, []);

  const fetchApis = async () => {
    try {
      const response = await axiosPublic.get("/apis");
      if (response.data.success) {
        setApis(response.data.data || []);
      } else {
        setApis([]);
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
      setApis([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosPublic.get("/stats");
      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      name: "",
      endpoint: "https://jsonplaceholder.typicode.com/users/1",
      method: "GET",
      requestBody: "",
      headers: "",
    });
    setTestResult(null);
    setCalculationSteps([]);
  };

  // Test API using your slide calculations
  const testApi = async () => {
    if (!form.endpoint) {
      alert("Please enter an API endpoint");
      return;
    }

    setTestingApi(true);
    setTestResult(null);
    setCalculationSteps([]);

    try {
      let parsedHeaders = {};
      if (form.headers) {
        try {
          parsedHeaders = JSON.parse(form.headers);
        } catch (e) {
          console.warn("Invalid JSON in headers, using empty object");
        }
      }

      let parsedBody = null;
      if (form.method !== "GET" && form.requestBody) {
        try {
          parsedBody = JSON.parse(form.requestBody);
        } catch (e) {
          console.warn("Invalid JSON in request body");
        }
      }

      const testData = {
        endpoint: form.endpoint,
        method: form.method,
        headers: parsedHeaders,
        body: parsedBody,
        region: config.region,
        dailyRequests: parseInt(config.dailyRequests) || 1000
      };

      console.log("🔄 Testing API with config:", testData);

      const response = await axiosPublic.post("/apis/test", testData);
      
      console.log("📦 Backend Response:", response.data);
      
      if (response.data.success === false && !response.data.isFallback && !response.data.isError) {
        alert(response.data.message || "Failed to test API");
        return;
      }
      
      setTestResult(response.data);
      
      // Set calculation steps
      if (response.data.calculationSteps) {
        setCalculationSteps(response.data.calculationSteps);
      }
      
    } catch (error) {
      console.error("❌ Error testing API:", error);
      console.error("❌ Error details:", error.response?.data);
      
      // Create a fallback result
      const fallbackResult = {
        success: false,
        statusCode: 0,
        responseTime: 0,
        totalBytes: 51200,
        payloadKB: "50.00",
        payloadMB: "0.05",
        payloadGB: "0.000048",
        dailyDataGB: "0.048",
        dailyEnergyWh: 39,
        dailyEnergyKWh: "0.039",
        dailyCO2g: "11.70",
        co2PerRequest: "0.0117",
        co2PerRequestMg: "11.70",
        greenScore: "High",
        isFallback: true,
        message: `Network error. Using fallback calculations: ${error.message}`
      };
      
      setTestResult(fallbackResult);
      setCalculationSteps([
        "Step 1: 51200 bytes → 0.000048 GB",
        "Step 2: Energy = 0.000048 GB × 0.81 Wh/GB = 0.000039 Wh per request",
        "Step 3: Daily = 0.039 kWh × 300 g/kWh = 11.70 g CO₂"
      ]);
    } finally {
      setTestingApi(false);
    }
  };

  // Add API with calculated metrics
  const addApi = async () => {
    if (!form.name || !form.endpoint) {
      alert("Please enter API name and endpoint");
      return;
    }

    if (!testResult) {
      alert("Please test the API first to get calculated metrics");
      return;
    }

    setLoading(true);
    // In ApiManagement.jsx, add this helper function:

const formatScientific = (num) => {
  const number = parseFloat(num);
  if (number === 0) return "0";
  
  if (typeof num === 'string' && num.includes('e')) {
    // Already in scientific notation
    const [base, exponent] = num.split('e');
    return `${parseFloat(base).toFixed(3)} × 10^${exponent}`;
  }
  
  if (number < 0.000001) {
    return number.toExponential(3);
  }
  
  if (number < 0.001) {
    return number.toFixed(6);
  }
  
  if (number < 1) {
    return number.toFixed(4);
  }
  
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Update the display in the test results section:

{testResult.energyPerRequestWh && (
  <div className="bg-white p-3 rounded-lg border border-green-200">
    <div className="text-gray-600 text-xs font-medium">Energy per Request</div>
    <div className="font-bold text-lg text-blue-800">
      {formatScientific(testResult.energyPerRequestWh)} Wh
    </div>
    <div className="text-xs text-gray-500">
      {testResult._rawNumbers?.energyPerRequestWh && 
        `Raw: ${testResult._rawNumbers.energyPerRequestWh.toExponential(3)} Wh`}
    </div>
  </div>
)}

{testResult.co2PerRequestG && (
  <div className="bg-white p-3 rounded-lg border border-green-200">
    <div className="text-gray-600 text-xs font-medium">CO₂ per Request</div>
    <div className="font-bold text-lg text-red-800">
      {formatScientific(testResult.co2PerRequestG)} g
    </div>
    <div className="text-xs text-gray-500">
      {testResult.co2PerRequestMg} mg
    </div>
  </div>
)}

    try {
      const apiData = {
        name: form.name,
        endpoint: form.endpoint,
        method: form.method,
        avgPayload: parseFloat(testResult.payloadKB) || 50,
        dailyRequests: parseInt(config.dailyRequests) || 1000,
        responseTime: testResult.responseTime || 0,
        region: config.region,
        description: `Analyzed using Green API Gateway - ${form.method} ${form.endpoint}`,
        greenScore: testResult.greenScore || "Medium"
      };

      const response = await axiosPublic.post("/apis", apiData);
      
      if (response.data.success) {
        // Add to local state
        setApis([...apis, response.data.data]);
        // Refresh stats
        fetchDashboardStats();
        clearForm();
        alert("✅ API added successfully with sustainability metrics!");
      } else {
        alert(response.data.message || "Failed to add API");
      }
    } catch (error) {
      console.error("Error adding API:", error);
      alert(`Failed to add API: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove operations
  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));
  };

  const removeSelected = async () => {
    if (!selected.length) return;

    if (window.confirm(`Are you sure you want to delete ${selected.length} API(s)?`)) {
      try {
        const response = await axiosPublic.delete("/apis/batch", { 
          data: { ids: selected } 
        });
        
        if (response.data.success) {
          setApis(apis.filter((a) => !selected.includes(a._id)));
          setSelected([]);
          fetchDashboardStats();
          alert(`✅ ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error deleting APIs:", error);
        alert("Failed to delete APIs");
      }
    }
  };

  const removeAll = async () => {
    if (!window.confirm("This will delete ALL APIs. Are you sure?")) return;

    try {
      const response = await axiosPublic.delete("/apis/all");
      if (response.data.success) {
        setApis([]);
        setSelected([]);
        fetchDashboardStats();
        alert("✅ All APIs deleted!");
      }
    } catch (error) {
      console.error("Error deleting all APIs:", error);
      alert("Failed to delete all APIs");
    }
  };

  // Badge styling matching your slide categories
  const badge = (score) => {
    switch (score) {
      case "Green":
        return "bg-green-100 text-green-800 border-2 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300";
      case "High":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300";
      case "Critical":
        return "bg-red-100 text-red-800 border-2 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-2 border-gray-300";
    }
  };

  // Format numbers
  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num || 0);
    if (number === 0) return "0";
    
    if (number < 0.0001) {
      return number.toExponential(4);
    }
    
    if (number < 1) {
      return number.toFixed(decimals + 2);
    }
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Get region color based on intensity
  const getRegionColor = (region) => {
    const intensities = {
      "France": "text-green-700 bg-green-50 border-green-200",
      "USA": "text-blue-700 bg-blue-50 border-blue-200",
      "India": "text-orange-700 bg-orange-50 border-orange-200",
      "South Asia": "text-red-700 bg-red-50 border-red-200",
      "Global Average": "text-gray-700 bg-gray-50 border-gray-200"
    };
    return intensities[region] || "text-gray-700 bg-gray-50 border-gray-200";
  };

  // Test with pre-defined APIs
  const testExampleAPI = (example) => {
    setForm({
      ...form,
      name: example.name,
      endpoint: example.endpoint,
      method: example.method
    });
  };

  const exampleAPIs = [
    { name: "JSONPlaceholder Users", endpoint: "https://jsonplaceholder.typicode.com/users", method: "GET" },
    { name: "JSONPlaceholder Posts", endpoint: "https://jsonplaceholder.typicode.com/posts", method: "GET" },
    { name: "JSONPlaceholder Comments", endpoint: "https://jsonplaceholder.typicode.com/comments", method: "GET" },
    { name: "GitHub API", endpoint: "https://api.github.com/users/octocat", method: "GET" }
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow">
            <FaLeaf className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Green API Gateway</h1>
            <p className="text-gray-600">
              Monitor, Measure, and Optimize API Energy & CO₂ Emissions
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center gap-2 transition-all hover:shadow-lg"
        >
          <FaCog />
          {showConfig ? "Hide Settings" : "Calculation Settings"}
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-700">
            <FaCalculator className="text-green-600" />
            Calculation Configuration (Based on Research)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaGlobe className="text-green-600" />
                Region / Data Center Location
              </label>
              <select
                name="region"
                value={config.region}
                onChange={handleConfigChange}
                className="w-full border-2 border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="France">🇫🇷 France (50 gCO₂/kWh) - Green</option>
                <option value="USA">🇺🇸 USA (300 gCO₂/kWh) - Medium</option>
                <option value="India">🇮🇳 India (650 gCO₂/kWh) - High</option>
                <option value="South Asia">🌏 South Asia (550 gCO₂/kWh)</option>
                <option value="Global Average">🌍 Global Average (475 gCO₂/kWh)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Grid intensity affects CO₂ calculations
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaBolt className="text-yellow-600" />
                Energy per GB Transfer
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="energyPerGB"
                  value={config.energyPerGB}
                  readOnly
                  className="w-full border-2 border-green-300 rounded-lg px-4 py-2 bg-gray-50"
                />
                <span className="ml-2 text-gray-600 font-medium">Wh/GB</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From research paper: 0.81 Wh/GB per API call
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaServer className="text-blue-600" />
                Daily API Requests
              </label>
              <input
                type="number"
                name="dailyRequests"
                value={config.dailyRequests}
                onChange={handleConfigChange}
                className="w-full border-2 border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                step="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Estimated daily call volume for calculations
              </p>
            </div>
          </div>

          {/* Calculation Formula Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <FaInfoCircle />
              Calculation Formula (From Research)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Step 1:</span>
                <code className="bg-white px-3 py-1 rounded border border-green-200">GB = bytes ÷ 1,073,741,824</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Step 2:</span>
                <code className="bg-white px-3 py-1 rounded border border-green-200">Energy (Wh) = GB × 0.81 Wh/GB</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Step 3:</span>
                <code className="bg-white px-3 py-1 rounded border border-green-200">CO₂ (g) = Energy (kWh) × Grid Intensity</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaServer className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-gray-600 text-sm font-medium">Total APIs</div>
                <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalAPIs}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBolt className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-gray-600 text-sm font-medium">Total Energy</div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatNumber(dashboardStats.totalEnergy)} Wh
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaCloud className="text-red-600 text-xl" />
              </div>
              <div>
                <div className="text-gray-600 text-sm font-medium">Total CO₂</div>
                <div className="text-2xl font-bold text-red-800">
                  {formatNumber(dashboardStats.totalCO2)} g
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaChartBar className="text-yellow-600 text-xl" />
              </div>
              <div>
                <div className="text-gray-600 text-sm font-medium">Avg Score</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {(() => {
                    const scores = dashboardStats.scoreDistribution || {};
                    if (!scores.Green && !scores.Medium && !scores.High && !scores.Critical) return "N/A";
                    
                    const total = Object.values(scores).reduce((a, b) => a + b, 0);
                    const weighted = (scores.Green || 0) * 4 + (scores.Medium || 0) * 3 + (scores.High || 0) * 2 + (scores.Critical || 0) * 1;
                    const avg = weighted / total;
                    
                    if (avg >= 3.5) return "Green";
                    if (avg >= 2.5) return "Medium";
                    if (avg >= 1.5) return "High";
                    return "Critical";
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADD & ANALYZE API */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-700">
            <span className="bg-green-100 p-2 rounded-lg">
              <FaPlus className="text-green-600" />
            </span>
            Add & Analyze External API
          </h3>

          {/* Quick Test Examples */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick test with examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleAPIs.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => testExampleAPI(example)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="API Name (e.g., User API)"
              className="w-full border-2 border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <div className="flex gap-2">
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="border-2 border-green-300 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              
              <input
                name="endpoint"
                value={form.endpoint}
                onChange={handleChange}
                placeholder="https://api.example.com/users"
                className="w-full border-2 border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Headers Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headers (JSON format - optional)
              </label>
              <textarea
                name="headers"
                value={form.headers}
                onChange={handleChange}
                placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                className="w-full border-2 border-green-300 rounded-lg px-4 py-2 h-20 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Request Body for POST/PUT/PATCH */}
            {form.method !== "GET" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Body (JSON format)
                </label>
                <textarea
                  name="requestBody"
                  value={form.requestBody}
                  onChange={handleChange}
                  placeholder='{"key": "value", "data": "example"}'
                  className="w-full border-2 border-green-300 rounded-lg px-4 py-2 h-32 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={testApi}
                disabled={testingApi || !form.endpoint}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center gap-2 disabled:bg-gray-400 hover:shadow-lg transition-all flex-1"
              >
                {testingApi ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing API...
                  </>
                ) : (
                  <>
                    <FaLeaf />
                    Test & Analyze Sustainability
                  </>
                )}
              </button>
              
              <button
                onClick={clearForm}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <FaChartBar />
                  Sustainability Analysis Results
                  {testResult.isFallback && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
                      Using Fallback
                    </span>
                  )}
                  {testResult.isError && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded ml-2">
                      Error
                    </span>
                  )}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-gray-600 text-xs font-medium">Response Size</div>
                    <div className="font-bold text-lg text-gray-800">{formatNumber(testResult.payloadKB)} KB</div>
                    <div className="text-xs text-gray-500">{formatNumber(testResult.totalBytes)} bytes</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-gray-600 text-xs font-medium">Response Time</div>
                    <div className="font-bold text-lg text-gray-800">{testResult.responseTime || "N/A"} ms</div>
                    <div className="text-xs text-gray-500">Status: {testResult.statusCode || "N/A"}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-gray-600 text-xs font-medium">Daily Energy</div>
                    <div className="font-bold text-lg text-blue-800">{formatNumber(testResult.dailyEnergyWh)} Wh</div>
                    <div className="text-xs text-gray-500">{formatNumber(testResult.dailyEnergyKWh)} kWh</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-gray-600 text-xs font-medium">Daily CO₂</div>
                    <div className="font-bold text-lg text-red-800">{formatNumber(testResult.dailyCO2g)} g</div>
                    <div className="text-xs text-gray-500">{formatNumber(testResult.co2PerRequestMg)} mg per request</div>
                  </div>
                </div>

                {/* Calculation Steps */}
                {calculationSteps.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Calculation Steps:</div>
                    <div className="space-y-1">
                      {calculationSteps.map((step, idx) => (
                        <div key={idx} className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Green Score Display */}
                <div className="bg-white p-4 rounded-lg border border-green-200 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-600 text-sm font-medium">Sustainability Score</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-4 py-2 rounded-full text-lg font-bold ${badge(testResult.greenScore)}`}>
                          {testResult.greenScore}
                        </span>
                        {testResult.greenScore === "Green" && <FaCheckCircle className="text-green-500 text-xl" />}
                        {testResult.greenScore === "Critical" && <FaTimesCircle className="text-red-500 text-xl" />}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 text-sm font-medium">Configuration</div>
                      <div className="text-sm mt-1">
                        <span className={`px-3 py-1 rounded ${getRegionColor(config.region)}`}>
                          {config.region}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{config.dailyRequests} req/day</div>
                      </div>
                    </div>
                  </div>
                </div>

                {testResult.message && (
                  <div className={`text-sm p-3 rounded-lg ${
                    testResult.success === false ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    <FaInfoCircle className="inline mr-2" />
                    {testResult.message}
                  </div>
                )}
              </div>
            )}

            {/* Add API Button */}
            <button
              onClick={addApi}
              disabled={loading || !testResult}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg font-bold disabled:bg-gray-400 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Adding API to Dashboard...
                </>
              ) : (
                <>
                  <FaPlus />
                  Add API to Sustainability Dashboard
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Based on research: 0.81 Wh/GB energy consumption for API data transfer
            </p>
          </div>
        </div>

        {/* MANAGE APIS DASHBOARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-700">
            <span className="bg-red-100 p-2 rounded-lg">
              <FaTrash className="text-red-600" />
            </span>
            API Sustainability Dashboard ({apis.length} APIs)
          </h3>

          {apis.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white">
              <FaServer className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No APIs Analyzed Yet</p>
              <p className="text-sm mt-1 text-gray-500">Test and add your first API to see its environmental impact!</p>
              <button
                onClick={() => {
                  setForm({
                    ...form,
                    name: "Example User API",
                    endpoint: "https://jsonplaceholder.typicode.com/users/1"
                  });
                  document.querySelector('input[name="endpoint"]')?.focus();
                }}
                className="mt-6 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <FaPlus className="inline mr-2" />
                Test Example API
              </button>
            </div>
          ) : (
            <>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {apis.map((api) => (
                  <label
                    key={api._id}
                    className="flex justify-between items-center px-4 py-3 border-b last:border-none hover:bg-green-50 cursor-pointer transition-colors"
                  >
                    <div className="flex gap-3 items-center flex-grow">
                      <input
                        type="checkbox"
                        checked={selected.includes(api._id)}
                        onChange={() => toggleSelect(api._id)}
                        className="h-5 w-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{api.name}</p>
                            <p className="text-xs text-gray-500 font-mono truncate max-w-md">
                              {api.method} {api.endpoint}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${badge(
                              api.greenScore
                            )}`}
                          >
                            {api.greenScore}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                            <FaBolt className="text-xs" /> {formatNumber(api.energyUsed)} Wh
                          </span>
                          <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded flex items-center gap-1">
                            <FaCloud className="text-xs" /> {formatNumber(api.co2)} g CO₂
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {formatNumber(api.avgPayload)} KB
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getRegionColor(api.region)}`}>
                            {api.region || "Global"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-500 mt-3 px-1">
                <span>{selected.length} APIs selected</span>
                <div className="flex gap-4">
                  <span>Total: {apis.length} APIs</span>
                  <span className="text-green-600 font-medium">
                    {apis.filter(a => a.greenScore === "Green").length} Green
                  </span>
                </div>
              </div>

              <button
                onClick={removeSelected}
                disabled={selected.length === 0}
                className={`mt-4 w-full py-2 rounded-lg transition-all ${
                  selected.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
                }`}
              >
                <FaTrash className="inline mr-2" />
                Remove Selected APIs ({selected.length})
              </button>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <FaExclamationTriangle className="text-red-500" />
                  Danger Zone: This action cannot be undone
                </p>
                <button
                  onClick={removeAll}
                  disabled={apis.length === 0}
                  className={`w-full py-2 rounded-lg border-2 transition-all ${
                    apis.length === 0
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
                  }`}
                >
                  Remove All APIs from Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Score Legend */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow-lg border border-green-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaInfoCircle className="text-green-600" />
          Sustainability Score Legend
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-bold text-green-700">Green</span>
            </div>
            <p className="text-sm text-gray-600">≤ 0.01g CO₂ per request</p>
            <p className="text-xs text-gray-500 mt-1">Highly sustainable API</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="font-bold text-yellow-700">Medium</span>
            </div>
            <p className="text-sm text-gray-600">≤ 0.05g CO₂ per request</p>
            <p className="text-xs text-gray-500 mt-1">Moderate environmental impact</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="font-bold text-orange-700">High</span>
            </div>
            <p className="text-sm text-gray-600">≤ 0.1g CO₂ per request</p>
            <p className="text-xs text-gray-500 mt-1">Needs optimization</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-bold text-red-700">Critical</span>
            </div>
            <p className="text-sm text-gray-600"> 0.1g CO₂ per request</p>
            <p className="text-xs text-gray-500 mt-1">Immediate action needed</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiManagement;