import { useEffect, useState } from "react";

export default function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then(() => setBackendStatus("🟢 Backend Running"))
      .catch(() => setBackendStatus("🔴 Backend Not Running"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-green-400 mb-8">
        🚀 MERN Stack Setup Ready
      </h1>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Frontend</h2>
          <p className="text-green-400">🟢 Running</p>
          <p className="text-sm text-gray-400">{window.location.origin}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Backend</h2>
          <p>{backendStatus}</p>
          <p className="text-sm text-gray-400">http://localhost:5000</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Database</h2>
          <p className="text-yellow-400">⚠️ Check .env</p>
          <p className="text-sm text-gray-400">MongoDB Connection</p>
        </div>

      </div>

      {/* Setup Guide */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-300">
          ⚙️ Setup Guide
        </h2>

        <ol className="space-y-3 text-gray-300 list-decimal list-inside">
          <li>
            Create a <span className="text-green-400">.env</span> file inside
            <code className="ml-1 text-yellow-400">/server</code>
          </li>
          <li>
            Add MongoDB URI:
            <pre className="bg-black p-3 mt-2 rounded text-green-400">
MONGO_URI=mongodb://127.0.0.1:27017/myApp
JWT_SECRET=your_secret_key
            </pre>
          </li>
          <li>Start MongoDB locally OR use MongoDB Atlas</li>
          <li>Run backend: <code className="text-yellow-400">npm run dev</code></li>
          <li>Run frontend: <code className="text-yellow-400">npm run dev</code></li>
        </ol>
      </div>

      {/* API Test */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-300">
          🔌 Test API
        </h2>

        <button
          onClick={async () => {
            try {
              const res = await fetch("http://localhost:5000");
              const text = await res.text();
              alert("API Response: " + text);
            } catch {
              alert("Backend not reachable");
            }
          }}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Test Backend API
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm">
        Built with ❤️ using create-mern-pro
      </p>
    </div>
  );
}