// API Configuration
const API_BASE = (typeof window !== "undefined" && window.API_BASE_URL) || "http://localhost:3000/api";

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem("access_token");
}

// API request wrapper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return null;
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Login API
async function login(username, password) {
  const response = await apiRequest("/access/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return response;
}

// Salinity APIs
async function getSalinityDashboard() {
  return apiRequest("/salinity/dashboard");
}

async function getMonthlyChart(year, month) {
  return apiRequest(`/salinity/monthly-chart?year=${year}&month=${month}`);
}

async function getMonthlyComment(year, month) {
  return apiRequest(`/salinity/monthly-comment?year=${year}&month=${month}`);
}

async function saveMonthlyComment(year, month, comment) {
  return apiRequest("/salinity/monthly-comment", {
    method: "POST",
    body: JSON.stringify({ year, month, comment }),
  });
}

async function getAllStations() {
  return apiRequest("/salinity/stations/all-station");
}

async function getMaxStations(month) {
  return apiRequest(`/salinity/stations/max-stations?month=${month}`);
}

async function getStationDetail(stationId, from, to) {
  return apiRequest(
    `/salinity/station?station_id=${stationId}&from=${from}&to=${to}`,
  );
}

async function getLatestBulletins() {
  return apiRequest("/salinity/bulletins/latest");
}

async function getBulletinsByMonth(month) {
  return apiRequest(`/salinity/bulletins/?month=${month}`);
}

async function saveBulletin(bulletin) {
  return apiRequest("/salinity/bulletins/", {
    method: "POST",
    body: JSON.stringify(bulletin),
  });
}

// Weather APIs
async function getWeatherForecast(maXa) {
  return apiRequest(`/weather/forecast/${maXa}`);
}
