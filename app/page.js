"use client"
// Home screen
import { useState } from "react";
/*
  Render all unique neighborhoods as drop down menu for user to select
*/
export default function Home() {

  const [streetCount, setStreetCount] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const fakeNeighborhoods = ["Cool neighborhood", "Uncool neighborhood", "Decent place", "Newtown", "Oldtown"]

  function handleSubmit(e) {
    e.preventDefault();

    console.log("boo!");
    const defaultCount = streetCount || 10;
    setStreetCount(defaultCount);
    console.log("Selected: " + selectedNeighborhood);
    console.log("Street count: " + defaultCount);
  }

  return (
    <div>
      <h1>OnlyTreats</h1>
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
          {fakeNeighborhoods.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <input
          placeholder="Number of streets"
          value={streetCount}
          type="number"
          onChange={(e) => setStreetCount(e.target.value)}
        />
        <button type="submit">Spooky Search</button>
      </form>
    </div>
  );
}
