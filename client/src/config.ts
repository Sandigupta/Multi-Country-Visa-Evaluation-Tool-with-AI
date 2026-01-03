// Centralized configuration for the client application

// API Base URL
// In production, this should be set via the VITE_API_URL environment variable.
// In development, it falls back to localhost:5000.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://multi-country-visa-evaluation-tool-with.onrender.com";
