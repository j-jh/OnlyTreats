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
  async function handleSubmit(e) {
    e.preventDefault();

    console.log("boo!");
    let defaultCount = streetCount || 3;
    if (defaultCount <= 0) {
      defaultCount = 3;
    }

    setStreetCount(defaultCount);

    try {
      setLoadingResults(true);
      setError("");
      const response = await fetch(`/api/top-streets?neighborhood=${selectedNeighborhood}&count=${defaultCount}`);
      if (!response.ok) {
        setError("Failed to fetch streets")
        return;
      }
      const results = await response.json();
      setSearchResults(results);
      return;
    } catch (error) {
      setError("Error fetching streets: " + error.message);
      return;
    } finally {
      setLoadingResults(false);
    }
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
            }
            }
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
        </form>
      }

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingResults ? (
        <h1>Loading results...</h1>
      ) : (
        searchResults && (
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
                // Onclick triggers ai summary for street
                <tr key={id} onClick={() => console.log(item.street)}>
                  <td>{id + 1}</td>
                  <td>{item.street}</td>
                  <td>{item.score}</td>
                  <td>{item.num_houses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
