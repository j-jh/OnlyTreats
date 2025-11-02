"use client"
import Link from 'next/link';
import { useState, useEffect } from "react";
/*
    /app/page.js
    Home Screen for OnlyTreats
    ---
    User Interface
    --
      - Static map, neighborhood selection, count input, search, clear
      - Dynamically rendered SF neighborhoods drop down menu
        - Neighborhood AI summary
      - Dynamically rendered top n streets for given neighborhood and n count
        - Street AI summary on street item click 
      - Conditional rendering for loading state, results

    Event Handlers
    --
      fetchNeighborhoods(): 
        - Fetch list of SF neighborhoods
      sanitizeCount():
        - Sanitize input street count
      fetchNeighborhoodSummary(): 
        - Fetch OpenAI API endpoint for AI gen neighborhood summary
      handleSubmit(e):
        - Fetch API endpoint to get top n neighborhoods by candy score rank
      handleStreetClick(street):
        - Fetch OpenAI API endpoint for AI gen street summary
      handleClear():
        - Set all state to default values
*/
export default function Home() {
  // My very clear naming conventions
  const [streetCount, setStreetCount] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [streetSummary, setStreetSummary] = useState("");
  const [neighborhoodSummary, setNeighborhoodSummary] = useState("");
  const [loadingNeighborhoodSummary, setLoadingNeighborhoodSummary] = useState(false);

  // Fetch list of SF neighborhoods on component mount
  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  /*
    fetchNeighborhoods
    ---
    Params: null

    Behaviors: 
      - Set loading state to true
      - Fetch API to get list of SF neighborhoods
      - Error message on fail
      - Neighborhoods state with array on success
      - Set loading state to false
  */
  async function fetchNeighborhoods() {
    try {
      setLoadingNeighborhoods(true);
      const response = await fetch(`/api/neighborhoods`)
      if (!response.ok) {
        setError("Failed to fetch neighborhoods")
        return;
      }
      const results = await response.json();
      setNeighborhoods(results);
      return;
    } catch (error) {
      setError("Error fetching neighborhoods: " + error.message);
      return;
    } finally {
      setLoadingNeighborhoods(false);
    }
  }
  /*
    sanitizeCount
    ---
    Params:
    - value: Number value for number of streets

    Behaviors:
    - Typecast param to Number
    - Check if within valid Number range
    - Return default count 3 if invalid
    - Return num with cap of 50 if success
  */
  function sanitizeCount(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
      return 3;
    }
    return Math.min(num, 50);
  }

  /*
    fetchNeighborhoodSummary(neighborhood)

    Param:
    - neighborhood: string for neighborhood name

    Behaviors:
    - Set loading state to true
    - Fetch API to get AI generated summary of neighborhood
    - Neighborhood summary string on success
    - Error state on failure
    - Set loading state to false
  */
  async function fetchNeighborhoodSummary(neighborhood) {
    try {
      setLoadingNeighborhoodSummary(true);
      const response = await fetch(`/api/ai-street-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ neighborhood: neighborhood, type: 'neighborhood' })
      });
      const results = await response.json();
      setNeighborhoodSummary(results.summary);
    } catch (error) {
      setNeighborhoodSummary("Failed to load neighborhood summary");
    } finally {
      setLoadingNeighborhoodSummary(false);
    }
  }
  /*
    handleSubmit(e)

    Params:
    - e: event object passed to event handler
    
    Behaviors:
    - Prevent refresh
    - Clear previous search fields and rendered summaries
    - Call sanitizeCount on street count
    - Set loading state to true, clear previous street states
    - Fetch API to get top count safeCount ranked streets for given neighborhood
    - Error message on failure
    - Search results list of objects containing:
      object: {
        id: int descending rank of candy score
        street: string street name
        score: int candy score
        num_houses: int number of houses on street
      }
    - Call neighborhood summary function
  */
  async function handleSubmit(e) {
    e.preventDefault();
    setSelectedStreet(null);
    setStreetSummary("");
    setSearchResults(null);
    setNeighborhoodSummary("");
    // Jumpscare debuggers 
    console.log("boo!");
    const safeCount = sanitizeCount(streetCount);
    setStreetCount(safeCount);

    try {
      setLoadingResults(true);
      setError("");

      // Clear previous street selection
      setSelectedStreet(null);
      setStreetSummary("");

      // Fetch both streets and neighborhood summary
      const response = await fetch(`/api/top-streets?neighborhood=${selectedNeighborhood}&count=${safeCount}`);
      if (!response.ok) {
        setError("Failed to fetch streets")
        return;
      }
      const results = await response.json();
      setSearchResults(results);

      // Fetch neighborhood summary
      fetchNeighborhoodSummary(selectedNeighborhood);
      return;
    } catch (error) {
      setError("Error fetching streets: " + error.message);
      return;
    } finally {
      setLoadingResults(false);
    }
  }

  /*
    handleStreetClick(streetName)

    Params:
    - streetName: string for street name

    Behaviors:
    - Set loading state
    - Fetch API endpoint to gen AI summary of street
    - Error message on failure
    - String for street summary on success
  */
  async function handleStreetClick(streetName) {
    try {
      setSelectedStreet(streetName);
      setStreetSummary("Loading...");
      const response = await fetch(`/api/ai-street-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ street: streetName, neighborhood: selectedNeighborhood, type: 'street' })
      });
      const results = await response.json();
      setStreetSummary(results.summary);
      return;
    } catch (error) {
      setError("Error fetching AI summary: " + error.message);
      setStreetSummary("Failed to load summary");
      return;
    }
  }
  /*
    handleClear

    Params: null

    Behaviors:
    - Set default value to all states
  */
  function handleClear() {
    setNeighborhoodSummary("");
    setError("");
    setStreetSummary("");
    setStreetCount("");
    setSelectedNeighborhood("");
    setSelectedStreet("");
    setSearchResults(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1"></div>
          <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg text-center flex-1">
            🎃OnlyTreats👻
          </h1>
          <div className="flex-1 flex justify-end">
            <Link 
              href="/about"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              About
            </Link>
          </div>
        </div>

        {/* Static neighborhoods map of SF for search reference */}
        <div className="w-full max-w-lg mx-auto border-4 border-orange-300 rounded-lg overflow-hidden shadow-xl mb-6">
          <iframe
            src="https://data.sfgov.org/dataset/SF-Find-Neighborhoods/pty2-tcw4/embed?width=500&height=540"
            className="w-full h-[400px] border-0 block"
            loading="lazy"
            title="SF Neighborhoods Map"
          />
        </div>

        {/* Dynamically render list of SF neighborhoods */}
        {loadingNeighborhoods ? (
          <h1 className="text-3xl font-bold text-purple-600 text-center animate-pulse">
            Loading...
          </h1>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏙️ Neighborhood
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => {
                    setSelectedNeighborhood(e.target.value);
                    e.target.setCustomValidity("");
                  }}
                  required
                  onInvalid={(e) => e.target.setCustomValidity("Select an option")}
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900"
                >
                  <option value="" disabled>Select a neighborhood</option>
                  {neighborhoods.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏘️ Number of Streets
                </label>
                <input
                  placeholder="Number of streets"
                  value={streetCount}
                  type="number"
                  onChange={(e) => setStreetCount(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 text-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={loadingResults}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  Spooky Search
                </button>
                <button 
                  type="button" 
                  disabled={loadingResults} 
                  onClick={handleClear}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Error message if error present */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* AI neighborhood summary */}
        {loadingNeighborhoodSummary ? (
          <h1 className="text-3xl font-bold text-purple-600 text-center animate-pulse">
            Loading...
          </h1>
        ) : (
          neighborhoodSummary && (
            <div className="bg-gradient-to-r from-purple-100 to-orange-100 rounded-lg p-6 mb-6 shadow-lg border-2 border-purple-300">
              <h2 className="text-2xl font-bold text-purple-700 mb-3">
                Neighborhood Summary
              </h2>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {neighborhoodSummary.trim()}
              </p>
            </div>
          )
        )}

        {/* Search results containing rank, street, score, houses in neighborhood */}
        {loadingResults ? (
          <h1 className="text-3xl font-bold text-purple-600 text-center animate-pulse">
            Loading results...
          </h1>
        ) : (
          searchResults && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-gray-700 mb-4 font-medium">
                Click a street name to view its AI summary.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-purple-500 text-white">
                      <th className="px-6 py-3 text-left font-semibold">Rank</th>
                      <th className="px-6 py-3 text-left font-semibold">Street</th>
                      <th className="px-6 py-3 text-left font-semibold">Score</th>
                      <th className="px-6 py-3 text-left font-semibold">Houses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamically render search result columns for each property */}
                    {searchResults.map((item, id) => (
                      <tr 
                        key={id}
                        onClick={() => handleStreetClick(item.street)}
                        className="border-b border-gray-200 hover:bg-orange-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{id + 1}</td>
                        <td className="px-6 py-4 text-purple-600 font-medium">🪧 {item.street}</td>
                        <td className="px-6 py-4 text-orange-600 font-medium">🍬 {item.score}</td>
                        <td className="px-6 py-4 text-gray-700">🏠 {item.num_houses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* AI gen street summary */}
        {selectedStreet && (
          <div className="bg-gradient-to-r from-orange-100 to-purple-100 rounded-lg p-6 shadow-lg border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-orange-700 mb-3">
              {selectedStreet}
            </h3>
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {streetSummary.trim()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}