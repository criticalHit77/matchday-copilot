import React, { useState, useEffect, useRef } from "react";
import { mcpTools, getMcpLogs, clearMcpLogs } from "../mcpEngine";
import { MessageSquare, Terminal, Send, Bot, User, Trash2 } from "lucide-react";

export default function AgentChat() {
  const [messages, setMessages] = useState([
    {
      id: "msg_init",
      sender: "agent",
      text: "👋 ¡Hola! I'm your **MatchDay AI Agent**, powered by **Gemini 3** and **MongoDB Atlas**.\n\nI can help you coordinate your 2026 FIFA World Cup matches, plan transport, find nearby venues using Vector Search, and track your travel budget using Aggregation pipelines. Try one of the quick prompts below or ask me anything!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [logs, setLogs] = useState([]);
  
  const chatEndRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    setLogs(getMcpLogs());

    const handleLogAdded = (e) => {
      setLogs((prev) => [e.detail, ...prev].slice(0, 50));
    };
    
    const handleLogCleared = () => {
      setLogs([]);
    };

    window.addEventListener("mcp_log_added", handleLogAdded);
    window.addEventListener("mcp_log_cleared", handleLogCleared);

    return () => {
      window.removeEventListener("mcp_log_added", handleLogAdded);
      window.removeEventListener("mcp_log_cleared", handleLogCleared);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const runAgentQuery = async (queryText) => {
    // Add user message
    setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, sender: "user", text: queryText }]);
    setIsTyping(true);

    // Simulate Agent reasoning & Tool execution delay
    setTimeout(async () => {
      let agentResponse = "";
      const lower = queryText.toLowerCase();

      try {
        // Scenario 1: Vector Search Restaurants near stadium
        if (lower.includes("bar") || lower.includes("restaurant") || lower.includes("food") || lower.includes("bbq") || lower.includes("pizza") || lower.includes("vegan")) {
          // Determine which venue
          let venueId = "stadium_dallas"; // default
          let venueName = "AT&T Stadium (Dallas)";
          
          if (lower.includes("metlife") || lower.includes("new york") || lower.includes("nj")) {
            venueId = "stadium_ny_nj";
            venueName = "MetLife Stadium (New York/New Jersey)";
          } else if (lower.includes("vancouver") || lower.includes("bc place")) {
            venueId = "stadium_vancouver";
            venueName = "BC Place (Vancouver)";
          } else if (lower.includes("miami") || lower.includes("hard rock")) {
            venueId = "stadium_miami";
            venueName = "Hard Rock Stadium (Miami)";
          } else if (lower.includes("azteca") || lower.includes("mexico")) {
            venueId = "stadium_cdmx";
            venueName = "Estadio Azteca (Mexico City)";
          }

          // Semantic Vector Search
          const results = await mcpTools.vectorSearchRestaurants(venueId, queryText, 2);
          
          if (results.length > 0) {
            agentResponse = `🔍 **MongoDB Atlas Vector Search** matched these restaurants near **${venueName}** based on your interest: \n\n` +
              results.map((r, i) => `**${i+1}. ${r.name}** (${r.cuisine}) \n` +
              `• Rating: ⭐ ${r.rating} • Dist: ${r.distanceMiles} miles • Avg cost: $${r.averageCost} \n` +
              `• Match Score: **${Math.round(r.score * 100)}% Similarity** \n` +
              `• *"${r.description}"*`).join("\n\n") + 
              `\n\nWould you like me to reserve a table and add this to your itinerary?`;
          } else {
            agentResponse = `I found the stadium, but could not find matching restaurants for "${queryText}". Try asking for "sports bars" or "bbq".`;
          }
        } 
        // Scenario 2: Aggregation Budget Rollup
        else if (lower.includes("budget") || lower.includes("spent") || lower.includes("cost") || lower.includes("expense")) {
          const budget = await mcpTools.aggregateItineraryBudget();
          const limit = budget.budgetLimit;
          const total = budget.totalSpent;
          const status = total > limit ? "⚠️ **OVER BUDGET**" : "✅ **WITHIN LIMIT**";
          
          agentResponse = `📊 **MongoDB Aggregation Pipeline Report**:\n\n` +
            `• **Total Expenses**: $${total} / $${limit} (${Math.round((total/limit)*100)}%)\n` +
            `• **Activities Count**: ${budget.activitiesCount} records\n` +
            `• **Budget Status**: ${status}\n\n` +
            `**Category Breakdown:**\n` +
            Object.entries(budget.costBreakdown).map(([cat, val]) => `• **${cat.toUpperCase()}**: $${val}`).join("\n") +
            `\n\nThis rollup was compiled dynamically using an aggregation pipeline querying your \`itineraries\` collection.`;
        }
        // Scenario 3: Add Match Ticket
        else if (lower.includes("add match") || lower.includes("book match") || lower.includes("ecuador") || lower.includes("ticket")) {
          // Insert match
          const newAct = await mcpTools.insertItineraryActivity({
            type: "match",
            title: "Match Ticket: Mexico vs Ecuador",
            cost: 250,
            details: "Match 1 - Estadio Azteca. Row A, Seat 14.",
            dateTime: "2026-06-11 17:00"
          });
          
          agentResponse = `🎟️ **Itinerary Updated!** I have inserted your match ticket into the database.\n\n` +
            `• **Event**: Mexico vs Ecuador (Opening Match)\n` +
            `• **Location**: Estadio Azteca (Mexico City)\n` +
            `• **Cost**: $${newAct.cost}\n\n` +
            `The operation triggered \`db.itineraries.insertOne()\` on your MongoDB cluster. Your budget rollup has been updated.`;
        }
        // Scenario 4: Congestion check
        else if (lower.includes("congestion") || lower.includes("transit") || lower.includes("traffic") || lower.includes("sofi") || lower.includes("dallas")) {
          let city = "Dallas";
          let status = "Moderate Congestion";
          let lines = ["TRE Commuter Rail", "Shuttles"];
          
          if (lower.includes("sofi") || lower.includes("la")) {
            city = "Los Angeles";
            status = "Heavy Congestion";
            lines = ["Metro K Line", "SoFi Express Shuttle"];
          }
          
          agentResponse = `🚦 **Host City Transit Alert**:\n\n` +
            `Our MongoDB MCP queried the \`venues\` collection for **${city}**. Transit status is currently **${status}**.\n\n` +
            `• **Recommended Lines**: ${lines.join(", ")}\n` +
            `• **Fan Logistics Tip**: Try traveling at least 2 hours before kickoff to avoid peak crowd surges.`;
        }
        // Default generic response
        else {
          agentResponse = `I've received your query: "${queryText}".\n\nI can execute MongoDB operations for this. Try typing: \n` +
            `- "Recommend sports bars near MetLife Stadium"\n` +
            `- "Show my budget rollup"\n` +
            `- "Add my match ticket to Estadio Azteca"`;
        }
      } catch (err) {
        agentResponse = `Error executing tool: ${err.message}`;
      }

      setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, sender: "agent", text: agentResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    runAgentQuery(inputText);
    setInputText("");
  };

  // Helper to colorize MongoDB keywords
  const formatQuerySyntax = (queryText) => {
    if (!queryText) return "";
    
    // Highlight MongoDB commands, parameters, operators
    return queryText
      .replace(/(db\.\w+\.\w+)/g, '<span style="color:#00f576; font-weight:bold;">$1</span>')
      .replace(/(\$\w+)/g, '<span style="color:#a855f7; font-weight:bold;">$1</span>')
      .replace(/("vector_index"|vectorSearchRestaurants|insertOne|deleteOne|aggregate|find)/g, '<span style="color:#06b6d4;">$1</span>')
      .replace(/(true|false)/g, '<span style="color:#ffd700;">$1</span>')
      .replace(/(\d+)/g, '<span style="color:#ffd700;">$1</span>');
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", height: "100%", minHeight: "600px" }}>
      {/* Left Column: Conversational Chat Panel */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          <div style={{ background: "rgba(0, 245, 118, 0.1)", padding: "8px", borderRadius: "8px" }}>
            <Bot size={22} style={{ color: "var(--pitch-green)" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>MatchDay Copilot</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Gemini 3 Reasoning Engine • Online</p>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "8px", marginBottom: "16px", maxHeight: "400px" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: "4px", alignSelf: m.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: m.sender === "user" ? "flex-end" : "flex-start" }}>
                {m.sender === "user" ? (
                  <>You <User size={12} /></>
                ) : (
                  <><Bot size={12} style={{ color: "var(--pitch-green)" }} /> MatchDay Agent</>
                )}
              </div>
              <div className={`chat-bubble ${m.sender}`}>
                <div style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                  {m.text.split("\n\n").map((para, idx) => {
                    // Simple inline bold formatting parser
                    let cleanPara = para;
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const parts = [];
                    let lastIndex = 0;
                    let match;
                    
                    while ((match = boldRegex.exec(para)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(para.substring(lastIndex, match.index));
                      }
                      parts.push(<strong key={match.index} style={{ color: "#fff" }}>{match[1]}</strong>);
                      lastIndex = boldRegex.lastIndex;
                    }
                    if (lastIndex < para.length) {
                      parts.push(para.substring(lastIndex));
                    }

                    return (
                      <p key={idx} style={{ marginBottom: idx === m.text.split("\n\n").length - 1 ? 0 : "10px" }}>
                        {parts.length > 0 ? parts : para}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "10px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <div className="live-indicator" style={{ width: "6px", height: "6px" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Agent is calling MongoDB MCP...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick presets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Quick Queries:</span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              "Recommend sports bars near MetLife Stadium",
              "Compute my current budget rollup",
              "Add match ticket for Mexico vs Ecuador",
              "Check transit congestion at SoFi Stadium"
            ].map((p, idx) => (
              <span key={idx} className="prompt-tag" onClick={() => runAgentQuery(p)}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask agent to plan routes, recommend food, compile budgets..."
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "12px",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "var(--pitch-green)",
              color: "#000",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              padding: "0 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "var(--transition-smooth)"
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Right Column: Live MongoDB MCP Terminal Logger */}
      <div className="terminal-shell" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="terminal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Terminal size={14} style={{ color: "var(--pitch-green)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#9ca3af" }}>mongodb-mcp-server.log</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={clearMcpLogs}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
            >
              <Trash2 size={12} /> Clear Logs
            </button>
            <div className="terminal-dots">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
            </div>
          </div>
        </div>

        <div className="terminal-body" style={{ flex: 1 }}>
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className={`terminal-log-entry ${log.operation}`}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <span>[{log.timestamp}] MCP TOOL CALLED: {log.toolName}</span>
                  <span style={{ color: "var(--pitch-green)" }}>{log.executionTimeMs}ms</span>
                </div>
                <pre
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "8px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                    color: "#fff"
                  }}
                  dangerouslySetInnerHTML={{ __html: formatQuerySyntax(log.queryText) }}
                />
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "4px", paddingLeft: "4px" }}>
                  ➜ Result: Completed successfully. {log.resultCount} documents affected.
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", margin: "auto 0", padding: "40px" }}>
              [SYSTEM] MCP Server listening on port 5012...<br/>
              Awaiting tool commands from Gemini 3.
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
