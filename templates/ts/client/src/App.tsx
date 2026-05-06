import { useEffect, useState } from "react";

export default function App() {

  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [dbStatus, setDbStatus] = useState("Checking...");

  useEffect(() => {

    const checkServer = async () => {

      try {
        
        const res = await fetch(
          "http://localhost:5000/health"
        );

        const data = await res.json();

        // Backend Status
        if (data.server) {
          setBackendStatus("🟢 Backend Running");
        } else {
          setBackendStatus("🔴 Backend Not Running");
        }

        // Database Status
        if (data.database) {
          setDbStatus("🟢 MongoDB Connected");
        } else {
          setDbStatus("🔴 MongoDB Not Connected");
        }

      } catch {

        setBackendStatus("🔴 Backend Not Running");
        setDbStatus("🔴 MongoDB Not Connected");

      }
    };

    // Initial check
    checkServer();

    // Auto refresh every 3 seconds
    const interval = setInterval(checkServer, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">

      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-green-400 mb-8">
        🚀 MERN Stack Setup Ready
      </h1>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* Frontend */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Frontend
          </h2>

          <p className="text-green-400">
            🟢 Running
          </p>

          <p className="text-sm text-gray-400">
            {window.location.origin}
          </p>
        </div>

        {/* Backend */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Backend
          </h2>

          <p>{backendStatus}</p>

          <p className="text-sm text-gray-400">
            {
              backendStatus.includes("Running")
                ? "http://localhost:5000"
                : "Server Offline"
            }
          </p>
        </div>

        {/* Database */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Database
          </h2>

          <p>{dbStatus}</p>

          <p className="text-sm text-gray-400">
            MongoDB Connection
          </p>
        </div>

      </div>

      {/* Setup Guide */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-300">
          ⚙️ Setup Guide
        </h2>

        <ol className="space-y-3 text-gray-300 list-decimal list-inside">

          <li>
            Open the{" "}
            <code className="text-yellow-400">
              server/.env
            </code>{" "}
            file
          </li>

          <li>
            Add your MongoDB connection string and JWT secret key
          </li>

          <li>
            Example:
            <pre className="bg-black p-3 mt-2 rounded text-green-400 overflow-x-auto">
{`MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key`}
            </pre>
          </li>

          <li>
            Start MongoDB locally OR use MongoDB Atlas
          </li>

          <li>
            Run backend:
            <code className="ml-2 text-yellow-400">
              npm run dev
            </code>
          </li>

          <li>
            Run frontend:
            <code className="ml-2 text-yellow-400">
              npm run dev
            </code>
          </li>

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

              const res = await fetch(
                "http://localhost:5000/health"
              );

              const data = await res.json();

              alert(`
Server: ${
  data.server
    ? "Running ✅"
    : "Not Running ❌"
}

MongoDB: ${
  data.database
    ? "Connected ✅"
    : "Not Connected ❌"
}
              `);

            } catch {

              alert("Backend not reachable ❌");

            }
          }}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
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