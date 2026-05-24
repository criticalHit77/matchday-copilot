import React, { useState, useEffect } from "react";
import { mcpTools, getVenues } from "../mcpEngine";
import { MapPin, Navigation, Info, Search, ShieldCheck } from "lucide-react";

export default function VenueMap() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [vectorQuery, setVectorQuery] = useState("sports bar with big screens");
  const [restaurants, setRestaurants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const list = getVenues();
    setVenues(list);
    if (list.length > 0) {
      setSelectedVenue(list[4]); // Default select Dallas
    }
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      handleVectorSearch();
    }
  }, [selectedVenue]);

  const handleVectorSearch = async () => {
    if (!selectedVenue) return;
    setIsSearching(true);
    // Simulate delay
    setTimeout(async () => {
      const results = await mcpTools.vectorSearchRestaurants(selectedVenue.id, vectorQuery, 3);
      setRestaurants(results);
      setIsSearching(false);
    }, 400);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", minHeight: "600px" }}>
      {/* Left Column: Map and Marker list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Navigation size={18} style={{ color: "var(--pitch-green)" }} />
              2026 Host Venues Map
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <div className="live-indicator" /> Live Transit Feed
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Click on any stadium pin to inspect capacity, check real-time transit congestion, and run semantic queries for local spots.
          </p>
        </div>

        {/* Map UI */}
        <div className="map-container">
          {/* Mock Map Background Outline */}
          <svg style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }} viewBox="0 0 100 100">
            {/* Simple simulated North America outline map */}
            <path d="M 10 20 Q 30 10 50 15 T 90 20 T 80 50 T 60 70 T 50 90 T 30 80 T 15 50 Z" fill="none" stroke="var(--pitch-green)" strokeWidth="1" />
            <path d="M 22 15 L 15 45 L 52 55 L 80 68 L 88 32 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="3" strokeWidth="0.5" />
          </svg>

          {/* Stadium Pins */}
          {venues.map((v) => {
            const isSelected = selectedVenue && selectedVenue.id === v.id;
            let transitClass = "stadium-marker";
            if (v.transitStatus === "Heavy Congestion") transitClass += " congested-heavy";
            if (v.transitStatus === "Moderate Congestion") transitClass += " congested-moderate";

            return (
              <div
                key={v.id}
                className="stadium-node"
                style={{
                  left: `${v.coordinates.x}%`,
                  top: `${v.coordinates.y}%`,
                  transform: `translate(-50%, -50%) ${isSelected ? "scale(1.25)" : "scale(1)"}`
                }}
                onClick={() => setSelectedVenue(v)}
              >
                <div className={transitClass} style={{
                  border: isSelected ? "3px solid var(--pitch-green)" : "3px solid #fff"
                }} />
                <span style={{
                  position: "absolute",
                  top: "22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(6, 8, 19, 0.85)",
                  color: isSelected ? "var(--pitch-green)" : "#fff",
                  fontSize: "0.7rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  border: `1px solid ${isSelected ? "var(--pitch-green)" : "rgba(255,255,255,0.1)"}`,
                  fontWeight: isSelected ? "bold" : "normal"
                }}>
                  {v.city}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Details & Vector Search Recommendations */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {selectedVenue ? (
          <>
            {/* Venue Details */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--pitch-green)", fontWeight: "600", textTransform: "uppercase" }}>
                    {selectedVenue.country} Host Stadium
                  </span>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "4px" }}>{selectedVenue.name}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{selectedVenue.city}</p>
                </div>
                <div className={`status-badge ${
                  selectedVenue.transitStatus === "Heavy Congestion" ? "heavy" :
                  selectedVenue.transitStatus === "Moderate Congestion" ? "moderate" : "normal"
                }`}>
                  {selectedVenue.transitStatus}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Seating Capacity</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#fff" }}>{selectedVenue.capacity.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Official Fan Zone</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--gold)" }}>{selectedVenue.fanZoneName}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "500" }}>Key Transit Links</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedVenue.transitLines.map((line, idx) => (
                    <span key={idx} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", padding: "4px 8px", borderRadius: "4px" }}>
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vector Search Portal */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={18} style={{ color: "var(--neon-cyan)" }} />
                  MongoDB Atlas Vector Search
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Query nearby restaurants/sports bars using 5-dimension mock semantic similarity.
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                  <input
                    type="text"
                    value={vectorQuery}
                    onChange={(e) => setVectorQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVectorSearch()}
                    placeholder="Search e.g. vegan burgers, texas bbq, craft beer..."
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "10px 12px 10px 34px",
                      color: "#fff",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>
                <button
                  onClick={handleVectorSearch}
                  disabled={isSearching}
                  style={{
                    backgroundColor: "var(--pitch-green)",
                    color: "#000",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0 16px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  {isSearching ? "Searching..." : "Vector Search"}
                </button>
              </div>

              {/* Presets */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["sports bar with big screens", "vegan comfort food", "traditional mexican tacos", "authentic post-oak bbq"].map((preset, idx) => (
                  <span
                    key={idx}
                    className="prompt-tag"
                    onClick={() => {
                      setVectorQuery(preset);
                      // Update immediately
                      setIsSearching(true);
                      setTimeout(async () => {
                        const results = await mcpTools.vectorSearchRestaurants(selectedVenue.id, preset, 3);
                        setRestaurants(results);
                        setIsSearching(false);
                      }, 400);
                    }}
                  >
                    "{preset}"
                  </span>
                ))}
              </div>

              {/* Search Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                {restaurants.length > 0 ? (
                  restaurants.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: "12px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#fff" }}>{r.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--neon-cyan)", fontWeight: "600", background: "rgba(6, 182, 212, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                          Vector Match: {Math.round(r.score * 100)}%
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{r.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <span>Cuisine: {r.cuisine} • Rating: ⭐ {r.rating}</span>
                        <span>Distance: {r.distanceMiles} miles • Avg Cost: ${r.averageCost}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", padding: "20px 0" }}>
                    No vector search results. Try a search or click another stadium.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Select a host city stadium on the map to begin.
          </div>
        )}
      </div>
    </div>
  );
}
