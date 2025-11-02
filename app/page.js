"use client"
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
    <div>
      <h1>OnlyTreats</h1>

      {/* Static neighborhoods map of SF for search reference */}
      <div>
        <iframe
          allow="geolocation"
          src="https://data.sfgov.org/dataset/SF-Find-Neighborhoods/pty2-tcw4/embed?width=500&height=540"
          width="80%"
          height="540"
          style={{ border: 0, padding: 0, margin: 0 }}
        />
      </div>

      {/* Dynamically render list of SF neighborhoods */}
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

      {/* Error message if error present */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* AI neighborhood summary */}
      {loadingNeighborhoodSummary ? (
        <h1>Loading...</h1>
      ) : (
        neighborhoodSummary && (
          <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>            {neighborhoodSummary}
          </div>
        )
      )}

      {/* Search results containing rank, street, score, houses in neighborhood */}
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

                {/* Dynamically render search result columns for each property */}
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

      {/* AI gen street summary */}
      {selectedStreet && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>          <h3>{selectedStreet}</h3>
          {streetSummary}
        </div>
      )}
    </div>
  );
}