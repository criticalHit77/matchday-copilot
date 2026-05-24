import React, { useState, useEffect } from "react";
import { mcpTools, getItinerary, getUserProfile } from "../mcpEngine";
import { Calendar, Trash2, Plus, DollarSign, Wallet, Percent } from "lucide-react";

export default function ItineraryHub() {
  const [itinerary, setItinerary] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Form states for adding a custom expense
  const [title, setTitle] = useState("");
  const [type, setType] = useState("match");
  const [cost, setCost] = useState("");
  const [details, setDetails] = useState("");

  const refreshItinerary = async () => {
    // Retrieve itinerary array
    const list = getItinerary();
    setItinerary([...list]);

    // Query MongoDB Aggregation pipeline for cost rollups
    const aggregated = await mcpTools.aggregateItineraryBudget();
    setBudgetData(aggregated);
  };

  useEffect(() => {
    setProfile(getUserProfile());
    refreshItinerary();

    // Listen to custom updates from other components
    const handleUpdate = () => refreshItinerary();
    window.addEventListener("itinerary_updated", handleUpdate);
    window.addEventListener("profile_updated", handleUpdate);

    return () => {
      window.removeEventListener("itinerary_updated", handleUpdate);
      window.removeEventListener("profile_updated", handleUpdate);
    };
  }, []);

  const handleDelete = async (id) => {
    await mcpTools.deleteItineraryActivity(id);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    await mcpTools.insertItineraryActivity({
      type,
      title,
      cost: Number(cost),
      details,
      dateTime: new Date().toISOString().slice(0, 16).replace("T", " ")
    });

    // Reset form
    setTitle("");
    setCost("");
    setDetails("");
  };

  // Helper icons for categories
  const getCategoryColor = (catType) => {
    switch (catType) {
      case "match": return "var(--pitch-green)";
      case "flight": return "var(--neon-cyan)";
      case "hotel": return "var(--neon-purple)";
      case "restaurant": return "var(--gold)";
      default: return "var(--text-secondary)";
    }
  };

  const percentSpent = budgetData
    ? Math.min(Math.round((budgetData.totalSpent / budgetData.budgetLimit) * 100), 100)
    : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", height: "100%", minHeight: "600px" }}>
      {/* Left Column: Itinerary Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} style={{ color: "var(--pitch-green)" }} />
            My Trip Timeline
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Review your scheduled bookings and match tickets. Changes will update MongoDB and rerun the aggregation pipeline.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            {itinerary.length > 0 ? (
              itinerary.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${getCategoryColor(act.type)}`,
                    transition: "var(--transition-smooth)"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#fff" }}>{act.title}</span>
                      <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>
                        {act.type}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{act.dateTime} • {act.details}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontWeight: "700", fontSize: "1rem", color: "var(--pitch-green)" }}>${act.cost}</span>
                    <button
                      onClick={() => handleDelete(act.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "4px",
                        transition: "var(--transition-smooth)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--neon-red)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Timeline is currently empty. Ask the chat assistant to add items!
              </div>
            )}
          </div>
        </div>

        {/* Add custom expense form */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} style={{ color: "var(--pitch-green)" }} />
            Add Custom Itinerary Item
          </h4>
          <form onSubmit={handleAddExpense} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Activity Title</label>
              <input
                type="text"
                placeholder="e.g. Flight to Vancouver, Lunch..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "8px", color: "#fff", fontSize: "0.8rem", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "8px", color: "#fff", fontSize: "0.8rem", outline: "none" }}
              >
                <option value="match" style={{ background: "#060813" }}>Match Ticket</option>
                <option value="flight" style={{ background: "#060813" }}>Flight</option>
                <option value="hotel" style={{ background: "#060813" }}>Hotel</option>
                <option value="restaurant" style={{ background: "#060813" }}>Dining</option>
                <option value="transit" style={{ background: "#060813" }}>Transit</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Est. Cost ($)</label>
              <input
                type="number"
                placeholder="Amount"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "8px", color: "#fff", fontSize: "0.8rem", outline: "none" }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "var(--pitch-green)",
                color: "#000",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                padding: "10px",
                cursor: "pointer",
                fontSize: "0.8rem",
                transition: "var(--transition-smooth)"
              }}
            >
              Add Item
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Aggregation Budget Rollup */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {budgetData ? (
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wallet size={18} style={{ color: "var(--gold)" }} />
              MongoDB Aggregation Output
            </h3>

            {/* Spent Radial Dial / Gauge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0" }}>
              <div style={{
                position: "relative",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: `conic-gradient(var(--pitch-green) ${percentSpent * 3.6}deg, rgba(255, 255, 255, 0.05) 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(0, 245, 118, 0.1)"
              }}>
                <div style={{
                  position: "absolute",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-main)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#fff" }}>${budgetData.totalSpent}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Spent</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "10px" }}>
                <span>Budget Limit: ${budgetData.budgetLimit}</span>
                <span style={{ color: percentSpent > 90 ? "var(--neon-red)" : "var(--pitch-green)", fontWeight: "600" }}>{percentSpent}% Spent</span>
              </div>
            </div>

            {/* Category Breakdown (Extracted from Pipeline `$mergeObjects`) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>Pipeline Category Summary</h4>
              {Object.keys(budgetData.costBreakdown).length > 0 ? (
                Object.entries(budgetData.costBreakdown).map(([cat, val]) => {
                  const barPercent = Math.min((val / budgetData.totalSpent) * 100, 100);
                  return (
                    <div key={cat} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                        <span style={{ textTransform: "uppercase", fontWeight: "600", color: "#fff" }}>{cat}</span>
                        <span style={{ color: "var(--text-secondary)" }}>${val}</span>
                      </div>
                      <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${barPercent}%`, background: getCategoryColor(cat), borderRadius: "3px" }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>No aggregated categories.</div>
              )}
            </div>

            {/* Budget Health Alert */}
            {budgetData.totalSpent > budgetData.budgetLimit ? (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                padding: "10px",
                color: "var(--neon-red)",
                fontSize: "0.75rem",
                lineHeight: "1.4"
              }}>
                <strong>⚠️ Budget Alert:</strong> Your total itinerary cost has exceeded the configured budget limit of ${budgetData.budgetLimit}! Consider removing high-cost transit or hotel items.
              </div>
            ) : percentSpent > 80 ? (
              <div style={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "8px",
                padding: "10px",
                color: "var(--gold)",
                fontSize: "0.75rem",
                lineHeight: "1.4"
              }}>
                <strong>⚠️ Warning:</strong> You have consumed over 80% of your configured budget.
              </div>
            ) : (
              <div style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.15)",
                borderRadius: "8px",
                padding: "10px",
                color: "var(--pitch-green)",
                fontSize: "0.75rem",
                lineHeight: "1.4"
              }}>
                <strong>✅ Healthy Status:</strong> Your total spent is well within your budget boundaries.
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Awaiting aggregation computations...
          </div>
        )}
      </div>
    </div>
  );
}
