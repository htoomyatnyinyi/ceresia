"use client";

import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("Bangkok");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // This function simulates the AI/Host deciding to use a tool
  const handleGetWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWeatherData(null);
    setError("");

    try {
      // 1. Discover the tool by fetching the manifest
      // A real MCP host would cache this and discover many tools
      const manifestResponse = await fetch("/ai-tools.json");
      const manifest = await manifestResponse.json();
      const weatherToolEndpoint = manifest.tools[0].endpoints[0];

      // 2. Use the discovered tool's URL to make the request
      const response = await fetch(`${weatherToolEndpoint.url}?city=${city}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <main className="flex min-h-screen flex-col items-center p-24">
    <main className="flex flex-col items-center p-24">
      <div className="w-full max-w-md p-8  rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">🌦️ MCP Weather Tool</h1>

        <form onSubmit={handleGetWeather}>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-sky-600"
          >
            City Name
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="e.g., Salaya"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Get Weather"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500">Error: {error}</p>}

        {weatherData && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900">
              {weatherData.location}
            </h2>
            <p className="text-4xl font-bold text-gray-800">
              {weatherData.temperature_celsius}°C
            </p>
            <p className="text-lg text-gray-600 capitalize">
              {weatherData.description}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
