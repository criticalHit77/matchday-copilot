# MatchDay 2026: FIFA World Cup Copilot

MatchDay is an interactive, glassmorphic dashboard built using **React** and **Vite** designed as a travel and planning copilot for fans attending the 2026 FIFA World Cup in Canada, Mexico, and the USA.

The application features a fully-simulated backend representing a **MongoDB Atlas Database** accessed via a **Model Context Protocol (MCP) Server** directly in the client.

---

## 🚀 Features

### 1. 💬 AI Agent Lounge
* **AI Agent Assistant:** A conversational assistant powered by a simulated Gemini reasoning engine. The assistant processes queries (e.g., searching for dining, adding match tickets, inspecting budgets) and calls underlying database tools.
* **Live MongoDB MCP Terminal:** Logs database actions executed by the agent in real time. Commands are displayed in clean, syntax-highlighted MongoDB query format (e.g., `aggregate`, `insertOne`, `deleteOne`).

### 2. 📅 Smart Itinerary Hub
* **Timeline Planner:** View, add, or remove flights, hotel stays, matches, and transit shuttles in a timeline format.
* **MongoDB Aggregation Analytics:** Runs a mock aggregation pipeline to rollup total spent expenses by category and compare it against the user's maximum budget limit, warning the user if they exceed their budget.

### 3. 🗺️ Host Venues & Maps
* **Host Cities Interactive Map:** Discover stadium pins across North America color-coded dynamically by real-time transit congestion.
* **Atlas Vector Search Portal:** Perform semantic keyword searches (e.g., "sports bar with big screens", "vegan comfort food") using a simulated 5-dimension cosine-similarity vector index against local dining venues.

---

## 🛠️ Technology Stack & Architecture

* **Frontend Framework:** React 18 & Vite
* **Styling:** Vanilla CSS with custom glassmorphism and custom animation design systems ([src/index.css](file:///Users/sanjaysmac/Documents/matchday-copilot/src/index.css))
* **Icons:** [Lucide React](https://lucide.dev)
* **Simulation Layer:**
  * [src/database.js](file:///Users/sanjaysmac/Documents/matchday-copilot/src/database.js): Hosts pre-seeded mock Atlas collections for matches, venues, user profiles, itineraries, and restaurants.
  * [src/mcpEngine.js](file:///Users/sanjaysmac/Documents/matchday-copilot/src/mcpEngine.js): Contains the simulated database driver, event listeners, cosine-similarity calculator, and MongoDB aggregate/find/update mock utilities.

---

## 📂 Key Code Components

* **Main Framework:** [App.jsx](file:///Users/sanjaysmac/Documents/matchday-copilot/src/App.jsx)
* **AI Agent Lounge Component:** [AgentChat.jsx](file:///Users/sanjaysmac/Documents/matchday-copilot/src/components/AgentChat.jsx)
* **Smart Itinerary Planner Component:** [ItineraryHub.jsx](file:///Users/sanjaysmac/Documents/matchday-copilot/src/components/ItineraryHub.jsx)
* **Interactive Map & Vector Search Component:** [VenueMap.jsx](file:///Users/sanjaysmac/Documents/matchday-copilot/src/components/VenueMap.jsx)

---

## 🏃 Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 📥 Installation
1. Clone this repository or open the project folder.
2. Install the package dependencies:
   ```bash
   npm install
   ```

### ⚡ Run Development Server
Start the local server with Vite:
```bash
npm run dev
```
Open your browser and navigate to the address listed in the terminal (typically `http://localhost:5173`).
