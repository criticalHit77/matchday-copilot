// MongoDB Atlas & MCP Server Tool Simulator for MatchDay 2026

import {
  initialMatches,
  initialVenues,
  initialRestaurants,
  initialUserProfile,
  initialItinerary
} from "./database";

// Active in-memory collections
let matches = [...initialMatches];
let venues = [...initialVenues];
let restaurants = [...initialRestaurants];
let userProfile = { ...initialUserProfile };
let itinerary = [...initialItinerary];

// Global logs captured by MCP server execution
let mcpLogs = [];

// Helper to add logs with MongoDB format
function logMcpQuery(toolName, collection, operation, parameters, resultCount, executionTimeMs) {
  const timestamp = new Date().toLocaleTimeString();
  
  // Format parameters to look like real MongoDB JSON queries
  const formattedParams = JSON.stringify(parameters, null, 2);
  
  const logMessage = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp,
    toolName,
    collection,
    operation,
    queryText: `db.${collection}.${operation}(${formattedParams === "{}" ? "" : formattedParams})`,
    resultCount,
    executionTimeMs
  };
  
  mcpLogs = [logMessage, ...mcpLogs].slice(0, 50); // Keep last 50 queries
  
  // Also dispatch event for React state updates
  window.dispatchEvent(new CustomEvent("mcp_log_added", { detail: logMessage }));
}

// Map keywords to 5D vector embeddings for mock vector search:
// [FoodQuality, LivelyVibe/Screens, CostFactor(lower cost = higher), Accessibility, VegetarianOptions]
function getQueryVector(queryText) {
  const query = queryText.toLowerCase();
  
  let vector = [0.5, 0.5, 0.5, 0.5, 0.5]; // Default neutral vector
  
  if (query.includes("sports bar") || query.includes("screens") || query.includes("beer")) {
    vector = [0.6, 0.95, 0.7, 0.8, 0.2];
  } else if (query.includes("bbq") || query.includes("meat") || query.includes("brisket")) {
    vector = [0.95, 0.8, 0.5, 0.7, 0.1];
  } else if (query.includes("vegan") || query.includes("vegetarian") || query.includes("healthy")) {
    vector = [0.9, 0.5, 0.6, 0.8, 0.98];
  } else if (query.includes("cheap") || query.includes("budget") || query.includes("street food")) {
    vector = [0.7, 0.6, 0.95, 0.7, 0.4];
  } else if (query.includes("fancy") || query.includes("view") || query.includes("craft beer")) {
    vector = [0.9, 0.8, 0.3, 0.85, 0.6];
  } else if (query.includes("mexican") || query.includes("tacos") || query.includes("margaritas")) {
    vector = [0.85, 0.8, 0.65, 0.85, 0.5];
  } else if (query.includes("pizza") || query.includes("italian")) {
    vector = [0.85, 0.6, 0.8, 0.8, 0.75];
  }
  
  return vector;
}

// Cosine Similarity between two 5D vectors
function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- EXPOSED MCP SERVER TOOLS (Simulating Gemini Agent tools) ---

export const mcpTools = {
  // 1. Get Match Schedules
  findMatches: async (filter = {}) => {
    const start = performance.now();
    let results = matches;
    
    // Simple filter matching
    if (filter.venueId) {
      results = results.filter(m => m.venueId === filter.venueId);
    }
    if (filter.date) {
      results = results.filter(m => m.date === filter.date);
    }
    if (filter.team) {
      const searchTeam = filter.team.toLowerCase();
      results = results.filter(m => m.teams.toLowerCase().includes(searchTeam));
    }
    
    const end = performance.now();
    logMcpQuery(
      "mongodb_mcp.find_matches",
      "matches",
      "find",
      filter,
      results.length,
      Math.round(end - start)
    );
    
    return results;
  },

  // 2. Vector Search Restaurants/Venues near a Stadium
  vectorSearchRestaurants: async (venueId, queryText, limit = 3) => {
    const start = performance.now();
    
    const queryVector = getQueryVector(queryText);
    const venueRestaurants = restaurants.filter(r => r.venueId === venueId);
    
    // Compute cosine similarity and sort
    const rankedResults = venueRestaurants
      .map(r => {
        const similarity = calculateCosineSimilarity(queryVector, r.embedding);
        return { ...r, score: similarity };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const end = performance.now();
    
    // Atlas Vector Search syntax payload log
    const mcpParams = {
      aggregate: [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 10,
            limit: limit,
            filter: { venueId: venueId }
          }
        },
        {
          $project: {
            name: 1,
            cuisine: 1,
            rating: 1,
            distanceMiles: 1,
            description: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ]
    };

    logMcpQuery(
      "mongodb_mcp.vector_search_restaurants",
      "restaurants",
      "aggregate",
      mcpParams,
      rankedResults.length,
      Math.round(end - start)
    );
    
    return rankedResults;
  },

  // 3. Aggregate Budget and Expenses Pipeline
  aggregateItineraryBudget: async () => {
    const start = performance.now();
    
    // Aggregate Pipeline simulation:
    // $match: { userId: "user_current" }
    // $group: sum cost, group categories, count activities
    const totalSpent = itinerary.reduce((sum, act) => sum + act.cost, 0);
    const count = itinerary.length;
    const categoriesSet = new Set(itinerary.map(act => act.type));
    const breakdown = itinerary.reduce((acc, act) => {
      acc[act.type] = (acc[act.type] || 0) + act.cost;
      return acc;
    }, {});

    const results = [
      {
        _id: "user_current",
        totalSpent,
        budgetLimit: userProfile.budgetLimit,
        activitiesCount: count,
        categories: Array.from(categoriesSet),
        costBreakdown: breakdown
      }
    ];

    const end = performance.now();
    
    const mcpParams = [
      { $match: { userId: "user_current" } },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$cost" },
          activitiesCount: { $sum: 1 },
          categories: { $addToSet: "$type" },
          costBreakdown: {
            $mergeObjects: {
              $arrayToObject: [
                [{ k: "$type", v: "$cost" }]
              ]
            }
          }
        }
      }
    ];

    logMcpQuery(
      "mongodb_mcp.aggregate_itinerary_budget",
      "itineraries",
      "aggregate",
      mcpParams,
      results.length,
      Math.round(end - start)
    );
    
    return results[0];
  },

  // 4. Add Activity to Itinerary (InsertOne)
  insertItineraryActivity: async (activityData) => {
    const start = performance.now();
    
    const newActivity = {
      id: `act_${Date.now()}`,
      type: activityData.type,
      title: activityData.title,
      dateTime: activityData.dateTime || new Date().toISOString().slice(0, 16).replace("T", " "),
      cost: Number(activityData.cost) || 0,
      details: activityData.details || ""
    };
    
    itinerary.push(newActivity);
    const end = performance.now();
    
    logMcpQuery(
      "mongodb_mcp.insert_itinerary_activity",
      "itineraries",
      "insertOne",
      newActivity,
      1,
      Math.round(end - start)
    );

    // Notify itinerary update event
    window.dispatchEvent(new CustomEvent("itinerary_updated", { detail: itinerary }));
    
    return newActivity;
  },

  // 5. Delete Activity from Itinerary (DeleteOne)
  deleteItineraryActivity: async (activityId) => {
    const start = performance.now();
    
    const initialLen = itinerary.length;
    itinerary = itinerary.filter(act => act.id !== activityId);
    const end = performance.now();
    
    logMcpQuery(
      "mongodb_mcp.delete_itinerary_activity",
      "itineraries",
      "deleteOne",
      { id: activityId },
      initialLen - itinerary.length,
      Math.round(end - start)
    );
    
    window.dispatchEvent(new CustomEvent("itinerary_updated", { detail: itinerary }));
    
    return { acknowledged: true, deletedCount: initialLen - itinerary.length };
  },

  // 6. Update User Profile Settings (UpdateOne)
  updateUserProfile: async (updateData) => {
    const start = performance.now();
    
    userProfile = { ...userProfile, ...updateData };
    const end = performance.now();
    
    logMcpQuery(
      "mongodb_mcp.update_user_profile",
      "user_profiles",
      "updateOne",
      {
        filter: { id: "user_current" },
        update: { $set: updateData }
      },
      1,
      Math.round(end - start)
    );
    
    window.dispatchEvent(new CustomEvent("profile_updated", { detail: userProfile }));
    return userProfile;
  }
};

// Standard state accessors
export const getMatches = () => matches;
export const getVenues = () => venues;
export const getRestaurants = () => restaurants;
export const getUserProfile = () => userProfile;
export const getItinerary = () => itinerary;
export const getMcpLogs = () => mcpLogs;
export const clearMcpLogs = () => {
  mcpLogs = [];
  window.dispatchEvent(new CustomEvent("mcp_log_cleared"));
};
export const getTransitStatus = (venueId) => {
  const v = venues.find(venue => venue.id === venueId);
  return v ? v.transitStatus : "Normal";
};
