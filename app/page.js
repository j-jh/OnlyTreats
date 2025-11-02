"use client"
// Home screen
import { useState, useEffect } from "react";

/*
  Render all unique neighborhoods as drop down menu for user to select
*/
export default function Home() {

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

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

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

  function sanitizeCount(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
      return 3;
    }
    return Math.min(num, 50);
  }

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

  async function handleSubmit(e) {
    e.preventDefault();

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
    <div>
      <h1>OnlyTreats</h1>

      <div>
        <iframe
          allow="geolocation"
          src="https://data.sfgov.org/dataset/SF-Find-Neighborhoods/pty2-tcw4/embed?width=500&height=540"
          width="80%"
          height="540"
          style={{ border: 0, padding: 0, margin: 0 }}
        />
      </div>

      {loadingNeighborhoods ? <h1>Loading...</h1> :
        <form onSubmit={handleSubmit}>
          <select
            value={selectedNeighborhood}
            onChange={(e) => {
              setSelectedNeighborhood(e.target.value);
              e.target.setCustomValidity("");
            }}
            required
            onInvalid={(e) => e.target.setCustomValidity("Select an option")}
          >
            <option value="" disabled>Select a neighborhood</option>
            {neighborhoods.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <input
            placeholder="Number of streets"
            value={streetCount}
            type="number"
            onChange={(e) => setStreetCount(e.target.value)}
          />
          <button type="submit" disabled={loadingResults}>Spooky Search</button>
          <button type="button" disabled={loadingResults} onClick={handleClear}>Clear</button>
        </form>
      }

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Neighborhood Summary */}
      {loadingNeighborhoodSummary ? (
        <h1>Loading...</h1>
      ) : (
        neighborhoodSummary && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <p>{neighborhoodSummary}</p>
          </div>
        )
      )}

      {loadingResults ? (
        <h1>Loading results...</h1>
      ) : (
        searchResults && (
          <>
            <p>
              Click a street name to view its AI summary.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Street</th>
                  <th>Score</th>
                  <th>Houses</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item, id) => (
                  <tr key={id} onClick={() => handleStreetClick(item.street)} style={{ cursor: 'pointer' }}>
                    <td>{id + 1}</td>
                    <td>{item.street}</td>
                    <td>{item.score}</td>
                    <td>{item.num_houses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      )}

      {/* Street Summary */}
      {selectedStreet && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <h3>{selectedStreet}</h3>
          <p>{streetSummary}</p>
        </div>
      )}
    </div>
  );
}