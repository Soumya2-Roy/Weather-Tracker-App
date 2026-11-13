
const API_KEY = "a1b4e024f4339188139f427700776616";

// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const $ = (id) => document.getElementById(id);

const searchForm = $("searchForm");
const cityInput = $("cityInput");
const searchButton = $("searchButton");
const message = $("message");
const weatherPanel = $("weatherPanel");

const elements = {
  cityName: $("cityName"),
  dateText: $("dateText"),
  description: $("description"),
  temperature: $("temperature"),
  feelsLike: $("feelsLike"),
  humidity: $("humidity"),
  windSpeed: $("windSpeed"),
  pressure: $("pressure"),
  weatherIcon: $("weatherIcon"),
  updatedText: $("updatedText")
};

const favoriteButton = $("favoriteButton");
const favoritesSection = $("favoritesSection");
const favoritesList = $("favoritesList");
const themeButton = $("themeButton");
const locationButton = $("locationButton");
const forecastList = $("forecastList");

// ========================================
// 2. APPLICATION STATE
// ========================================

let currentCity = "";
let currentCoordinates = null;
let weatherRequestId = 0;

function readFavorites() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("weatherFavorites") || "[]"
    );

    return Array.isArray(saved)
      ? saved.filter(city => typeof city === "string")
      : [];
  } catch {
    return [];
  }
}

let favorites = readFavorites();

// ========================================
// 3. API HELPER FUNCTIONS
// ========================================

function createApiUrl(endpoint, params) {
  const url = new URL(
    `https://api.openweathermap.org/data/2.5/${endpoint}`
  );

  url.search = new URLSearchParams({
    ...params,
    appid: API_KEY
  });

  return url;
}

async function fetchWeather(endpoint, params) {
  const url = createApiUrl(endpoint, params);
  const response = await fetch(url);

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The weather service returned an invalid response.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Invalid API key or key not activated yet."
      );
    }

    if (response.status === 404) {
      throw new Error(
        "City not found. Please check the spelling."
      );
    }

    if (response.status === 429) {
      throw new Error(
        "API request limit reached. Please try again later."
      );
    }

    throw new Error(
      data.message || "Unable to retrieve weather information."
    );
  }

  return data;
}

// ========================================
// 4. LOAD CURRENT WEATHER
// ========================================

async function loadWeather(params) {
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    message.textContent =
      "Please add your OpenWeatherMap API key in script.js.";
    return;
  }

  const requestId = ++weatherRequestId;

  searchButton.disabled = true;
  searchButton.textContent = "Loading...";
  message.textContent = "Fetching weather information...";

  try {
    const data = await fetchWeather("weather", {
      ...params,
      units: "metric"
    });

    // Ignore old responses when another search has started.
    if (requestId !== weatherRequestId) return;

    currentCity = data.name;

    currentCoordinates = {
      lat: data.coord.lat,
      lon: data.coord.lon
    };

    displayWeather(data);

    weatherPanel.hidden = false;
    message.textContent = "Weather loaded successfully.";

    renderFavorites();
    updateFavoriteButton();

    // Load the forecast after current weather is available.
    await loadForecast(currentCoordinates, requestId);

  } catch (error) {
    if (requestId === weatherRequestId) {
      message.textContent =
        error.message || "Network error. Please try again.";
    }
  } finally {
    if (requestId === weatherRequestId) {
      searchButton.disabled = false;
      searchButton.textContent = "Search";
    }
  }
}

// ========================================
// 5. DISPLAY CURRENT WEATHER
// ========================================

function displayWeather(data) {
  const weather = data.weather[0];

  elements.cityName.textContent =
    `${data.name}, ${data.sys.country}`;

  elements.dateText.textContent =
    new Date().toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    });

  elements.description.textContent =
    weather.description;

  elements.temperature.textContent =
    Math.round(data.main.temp);

  elements.feelsLike.textContent =
    `Feels like ${Math.round(data.main.feels_like)}°C`;

  elements.humidity.textContent =
    `${data.main.humidity}%`;

  elements.windSpeed.textContent =
    `${data.wind.speed} m/s`;

  elements.pressure.textContent =
    `${data.main.pressure} hPa`;

  elements.weatherIcon.src =
    `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  elements.weatherIcon.alt = weather.description;

  elements.updatedText.textContent =
    `Weather observation: ${new Date(
      data.dt * 1000
    ).toLocaleTimeString()}`;
}

// ========================================
// 6. FIVE-DAY WEATHER FORECAST
// ========================================

async function loadForecast(coords, requestId) {
  forecastList.replaceChildren();

  const loading = document.createElement("p");
  loading.textContent = "Loading forecast...";
  forecastList.appendChild(loading);

  try {
    const data = await fetchWeather("forecast", {
      lat: coords.lat,
      lon: coords.lon,
      units: "metric"
    });

    if (requestId !== weatherRequestId) return;

    forecastList.replaceChildren();

    // Group forecast entries by local calendar date.
    const groupedDays = new Map();

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const key = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ].join("-");

      if (!groupedDays.has(key)) {
        groupedDays.set(key, []);
      }

      groupedDays.get(key).push(item);
    }

    const today = new Date();
    const todayKey = [
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ].join("-");

    // Show five upcoming days, excluding today.
    const days = [...groupedDays.entries()]
      .filter(([key]) => key !== todayKey)
      .slice(0, 5);

    if (days.length === 0) {
      forecastList.textContent =
        "No forecast data is available.";
      return;
    }

    days.forEach(([, entries]) => {
      // Select the forecast closest to noon.
      const forecast = entries.reduce((best, item) => {
        const bestHour =
          new Date(best.dt * 1000).getHours();

        const itemHour =
          new Date(item.dt * 1000).getHours();

        return Math.abs(itemHour - 12) <
          Math.abs(bestHour - 12)
          ? item
          : best;
      });

      const date = new Date(forecast.dt * 1000);
      const card = document.createElement("article");
      card.className = "forecast-card";

      const day = document.createElement("p");
      day.textContent = date.toLocaleDateString(
        undefined,
        { weekday: "short", day: "numeric", month: "short" }
      );

      const icon = document.createElement("img");
      icon.src =
        `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      icon.alt = forecast.weather[0].description;

      const description = document.createElement("p");
      description.className = "forecast-description";
      description.textContent =
        forecast.weather[0].description;

      const temperature = document.createElement("strong");
      temperature.textContent =
        `${Math.round(forecast.main.temp)}°C`;

      card.append(day, icon, description, temperature);
      forecastList.appendChild(card);
    });

  } catch (error) {
    if (requestId === weatherRequestId) {
      forecastList.replaceChildren();

      const errorText = document.createElement("p");
      errorText.textContent =
        `Forecast unavailable: ${error.message}`;

      forecastList.appendChild(errorText);
    }
  }
}

// ========================================
// 7. FAVOURITE CITIES
// ========================================

function saveFavorites() {
  try {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify(favorites)
    );
  } catch {
    message.textContent =
      "Unable to save favourites in this browser.";
  }
}

function updateFavoriteButton() {
  if (!currentCity) {
    favoriteButton.textContent = "☆ Add Favourite";
    return;
  }

  const isFavorite = favorites.some(
    city => city.toLowerCase() === currentCity.toLowerCase()
  );

  favoriteButton.textContent = isFavorite
    ? "★ Remove Favourite"
    : "☆ Add Favourite";
}

function renderFavorites() {
  favoritesList.replaceChildren();
  favoritesSection.hidden = favorites.length === 0;

  favorites.forEach(city => {
    const wrapper = document.createElement("div");
    wrapper.className = "favorite-item";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "favorite-city";
    openButton.textContent = `🌤 ${city}`;

    openButton.addEventListener("click", () => {
      cityInput.value = city;
      loadWeather({ q: city });
    });

    wrapper.appendChild(openButton);
    favoritesList.appendChild(wrapper);
  });
}

favoriteButton.addEventListener("click", () => {
  if (!currentCity) {
    message.textContent = "Search for a city first.";
    return;
  }

  const index = favorites.findIndex(
    city => city.toLowerCase() === currentCity.toLowerCase()
  );

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(currentCity);
  }

  saveFavorites();
  renderFavorites();
  updateFavoriteButton();
});

// ========================================
// 8. DARK AND LIGHT THEMES
// ========================================

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  themeButton.textContent = isLight
    ? "🌙 Dark Mode"
    : "☀️ Light Mode";

  try {
    localStorage.setItem("weatherTheme", theme);
  } catch {
    // Theme still works for the current page.
  }
}

themeButton.addEventListener("click", () => {
  const isLight =
    document.body.classList.contains("light-theme");

  applyTheme(isLight ? "dark" : "light");
});

// ========================================
// 9. CURRENT LOCATION WEATHER
// ========================================

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    message.textContent =
      "Geolocation is not supported by your browser.";
    return;
  }

  message.textContent =
    "Requesting permission to access your location...";

  navigator.geolocation.getCurrentPosition(
    position => {
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      cityInput.value = "";
      loadWeather(coords);
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        message.textContent =
          "Location permission denied. Allow access in your browser settings.";
      } else if (error.code === error.TIMEOUT) {
        message.textContent =
          "Location request timed out. Please try again.";
      } else {
        message.textContent =
          "Unable to get your location. Please try again.";
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
});

// ========================================
// 10. SEARCH FOR A CITY
// ========================================

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    return;
  }

  loadWeather({ q: city });
});

// ========================================
// 11. INITIALIZE APPLICATION
// ========================================

try {
  applyTheme(localStorage.getItem("weatherTheme") || "dark");
} catch {
  applyTheme("dark");
}

renderFavorites();

if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
  message.textContent =
    "Add your OpenWeatherMap API key in script.js.";
} else {
  cityInput.value = "Kolkata";
  loadWeather({ q: "Kolkata" });
}
