import React, { useState, useEffect } from "react";
import AgentChat from "./components/AgentChat";
import ItineraryHub from "./components/ItineraryHub";
import VenueMap from "./components/VenueMap";
import { getUserProfile } from "./mcpEngine";
import { Bot, Calendar, MapPin, Database, Award, RefreshCw, Trophy } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("agent");
  const [timeLeft, setTimeLeft] = useState("");
  const [profile, setProfile] = useState(null);

  // Live countdown to June 11, 2026 (World Cup Kickoff)
  useEffect(() => {
    setProfile(getUserProfile());
    
    const kickoff = new Date("2026-06-11T17:00:00-06:00"); // Azteca Kickoff
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = kickoff - now;
      
      if (diff <= 0) {
        setTimeLeft("Tournament Started!");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    const handleProfileUpdate = (e) => {
      setProfile({ ...e.detail });
    };
    window.addEventListener("profile_updated", handleProfileUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("profile_updated", handleProfileUpdate);
    };
  }, []);

  return (
    <div className="dashboard-grid">
      {/* Sidebar Navigation */}
      <aside
        style={{
          background: "rgba(10, 14, 30, 0.95)",
          borderRight: "1px solid var(--border-color)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          height: "100vh",
          overflowY: "auto"
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--pitch-green) 0%, var(--neon-cyan) 100%)",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px var(--pitch-green-glow)"
          }}>
            <Trophy size={18} style={{ color: "#000" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "800", fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
              Match<span style={{ color: "var(--pitch-green)" }}>Day</span>
            </h1>
            <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", letterSpacing: "0.5px" }}>2026 World Cup Copilot</span>
          </div>
        </div>

        {/* Live Countdown Panel */}
        <div className="glass-panel" style={{ padding: "12px 16px", background: "rgba(0, 245, 118, 0.03)", borderColor: "rgba(0, 245, 118, 0.15)" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>
            Countdown to Kickoff
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--pitch-green)", marginTop: "4px", fontFamily: "var(--font-display)" }}>
            {timeLeft}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { id: "agent", label: "AI Agent Lounge", icon: Bot },
            { id: "itinerary", label: "My Itinerary Hub", icon: Calendar },
            { id: "map", label: "Host Venues & Map", icon: MapPin }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: isActive ? "rgba(0, 245, 118, 0.08)" : "transparent",
                  color: isActive ? "var(--pitch-green)" : "var(--text-secondary)",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? "600" : "500",
                  transition: "var(--transition-smooth)",
                  borderLeft: isActive ? "3px solid var(--pitch-green)" : "3px solid transparent"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Database Status Panel */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="glass-panel" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#fff", fontWeight: "600" }}>
              <Database size={12} style={{ color: "var(--neon-cyan)" }} />
              MongoDB Atlas Integration
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Cluster:</span>
                <span style={{ color: "var(--text-primary)" }}>M0-Free-Cluster</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>MCP Status:</span>
                <span style={{ color: "var(--pitch-green)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <div className="live-indicator" style={{ width: "6px", height: "6px" }} /> Connected
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Region:</span>
                <span style={{ color: "var(--text-primary)" }}>us-east-1 (AWS)</span>
              </div>
            </div>
          </div>

          {/* User profile capsule */}
          {profile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-cyan) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#fff"
              }}>
                {profile.name[0]}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#fff" }}>{profile.name}</span>
                <span style={{ fontSize: "0.65rem", color: "var(--gold)" }}>Limit: ${profile.budgetLimit}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Dashboard Space */}
      <main className="main-content">
        {/* Header Stats Bar */}
        <header
          className="glass-panel"
          style={{
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h2 className="text-gradient" style={{ fontSize: "1.4rem", fontWeight: "700" }}>
              {activeTab === "agent" && "Agent Playground"}
              {activeTab === "itinerary" && "Smart Itinerary Planner"}
              {activeTab === "map" && "Host Venues & Maps"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {activeTab === "agent" && "Query venues using vector search and test aggregation pipelines."}
              {activeTab === "itinerary" && "Plan matches, flights, hotels, and verify budgets."}
              {activeTab === "map" && "Discover host stadiums and filter local spots using spatial details."}
            </p>
          </div>

          {/* Tournament Overview Stats */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Matches</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fff" }}>104 Games</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Host Venues</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fff" }}>16 Cities</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Est. Fans</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--pitch-green)" }}>3.5M+</div>
            </div>
          </div>
        </header>

        {/* Main Tab Render Workspace */}
        <div style={{ flex: 1 }}>
          {activeTab === "agent" && <AgentChat />}
          {activeTab === "itinerary" && <ItineraryHub />}
          {activeTab === "map" && <VenueMap />}
        </div>
      </main>
    </div>
  );
}
