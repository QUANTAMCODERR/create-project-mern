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
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            🚀 MERN Stack Setup Ready ✨
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Your full-stack app is almost ready to go! Follow the guide below.
          </p>

        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Frontend */}
          <div className="rounded-3xl border border-green-500/30 bg-gradient-to-br from-[#08121f] to-[#0d1320] p-6 shadow-[0_0_40px_rgba(34,197,94,0.15)] hover:scale-[1.02] transition-all duration-300">

            <div className="flex items-center gap-4">

              <div className="text-5xl">
                💻
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Frontend
                </h2>

                <p className="text-green-400 mt-1">
                  🟢 Running
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {window.location.origin}
                </p>

              </div>

            </div>

          </div>

          {/* Backend */}
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#12081f] to-[#0d1320] p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:scale-[1.02] transition-all duration-300">

            <div className="flex items-center gap-4">

              <div className="text-5xl">
                🖥️
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Backend
                </h2>

                <p
                  className={`mt-1 ${backendStatus.includes("Running")
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  {backendStatus}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {
                    backendStatus.includes("Running")
                      ? "http://localhost:5000"
                      : "Server Offline"
                  }
                </p>

              </div>

            </div>

          </div>

          {/* Database */}
          <div className="rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-[#1f1808] to-[#0d1320] p-6 shadow-[0_0_40px_rgba(234,179,8,0.15)] hover:scale-[1.02] transition-all duration-300">

            <div className="flex items-center gap-4">

              <div className="text-5xl">
                🗄️
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Database
                </h2>

                <p
                  className={`mt-1 ${dbStatus.includes("Connected")
                      ? "text-green-400"
                      : "text-yellow-400"
                    }`}
                >
                  {dbStatus}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  MongoDB Connection
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Setup Guide */}
        <div className="rounded-3xl border border-cyan-500/20 bg-[#09111f]/80 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(0,255,255,0.08)] mb-10">

          <h2 className="text-4xl font-bold mb-8 text-white">
            ⚙️ Setup Guide
          </h2>

          <div className="space-y-6 text-gray-300 text-lg">

            <div className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                1
              </div>

              <p>
                Open the{" "}
                <code className="text-green-400">
                  server/.env
                </code>{" "}
                file
              </p>

            </div>

            <div className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                2
              </div>

              <div className="w-full">

                <p className="mb-3">
                  Add your MongoDB connection string and JWT secret key
                </p>

                <div className="bg-[#050816] border border-cyan-500/20 rounded-2xl p-5 overflow-x-auto">

                  <pre className="text-green-400 text-sm md:text-base whitespace-pre-wrap">
                    {`MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key`}
                  </pre>

                </div>

              </div>

            </div>

            <div className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                3
              </div>

              <p>
                Start MongoDB locally OR use{" "}
                <span className="text-cyan-400">
                  MongoDB Atlas
                </span>
              </p>

            </div>

            <div className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                4
              </div>

              <p>
                Run backend:
                <code className="ml-3 text-yellow-400">
                  npm run dev
                </code>
              </p>

            </div>

            <div className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                5
              </div>

              <p>
                Run frontend:
                <code className="ml-3 text-yellow-400">
                  npm run dev
                </code>
              </p>

            </div>

          </div>

        </div>

        {/* API Test */}
        <div className="rounded-3xl border border-green-500/20 bg-[#09111f]/80 backdrop-blur-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_0_60px_rgba(34,197,94,0.08)]">

          <div>

            <h2 className="text-3xl font-bold text-white">
              🔌 Test API
            </h2>

            <p className="text-gray-400 mt-2">
              Make sure your backend is running and test the API.
            </p>

          </div>

          <button
            onClick={async () => {

              try {

                const res = await fetch(
                  "http://localhost:5000/health"
                );

                const data = await res.json();

                alert(`
Server: ${data.server
                    ? "Running ✅"
                    : "Not Running ❌"
                  }

MongoDB: ${data.database
                    ? "Connected ✅"
                    : "Not Connected ❌"
                  }
              `);

              } catch {

                alert("Backend not reachable ❌");

              }
            }}
            className="mt-6 md:mt-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 text-lg font-semibold"
          >
            🚀 Test Backend API
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-12">
          Built with ❤️ using create-mern-pro
        </p>

      </div>

    </div>
  );
}