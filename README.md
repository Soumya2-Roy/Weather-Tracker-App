# 🌤️ Weather Tracker | Real-Time Weather Dashboard

**A responsive, API-powered weather application built with HTML5, CSS3, and JavaScript.**

Weather Tracker is an interactive frontend web application that retrieves real-time weather conditions and five-day forecasts using the OpenWeatherMap REST API. It combines asynchronous API communication, browser-based data persistence, dynamic DOM manipulation, and responsive interface design to deliver an intuitive weather monitoring experience.

**[🌐 Live Demo](https://adorable-mochi-06665f.netlify.app/)**

---

## 📌 Project Overview

The objective of this project is to develop a responsive weather dashboard that allows users to search for cities, monitor current weather conditions, explore upcoming forecasts, and personalize their experience through saved preferences.

The application demonstrates practical frontend software engineering concepts, including REST API consumption, asynchronous JavaScript, client-side state management, event-driven programming, and browser storage.

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌍 Real-Time Weather | Retrieve current weather information for searched cities |
| 📅 Five-Day Forecast | Display upcoming weather conditions with forecast cards |
| 📍 Geolocation | Retrieve weather data using the user's current location |
| 🌡️ Temperature Conversion | Switch dynamically between Celsius and Fahrenheit |
| ⭐ Favourite Cities | Save, remove, and revisit frequently searched cities |
| 🕘 Recent Search History | Store and display the five most recently searched cities |
| 🗑️ Clear History | Remove saved recent searches |
| 🌙 Theme Switching | Toggle between dark and light modes |
| 📱 Responsive Interface | Adapt the dashboard to desktop and mobile screen sizes |
| ⚠️ Error Handling | Display meaningful messages for invalid cities, API failures, and location errors |

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| API Integration | OpenWeatherMap REST API |
| Asynchronous Programming | Fetch API, Async/Await, Promises |
| Browser APIs | Geolocation API, Local Storage |
| UI Development | CSS Flexbox, CSS Grid, Media Queries |
| Development Tools | Visual Studio Code |
| Version Control | Git |
| Source Code Hosting | GitHub |
| Deployment | Netlify |

## 🏗️ Application Architecture

The application follows a client-side architecture in which JavaScript manages user interactions, requests weather data from the OpenWeatherMap API, processes JSON responses, and dynamically updates the interface.

```text
                   USER
                    |
                    v
            WEATHER TRACKER UI
              (HTML + CSS)
                    |
                    v
             JAVASCRIPT LOGIC
                    |
         +----------+----------+
         |                     |
         v                     v
    WEATHER API           BROWSER APIs
         |                     |
    +----+----+          +-----+------+
    |         |          |            |
 Current   5-Day      Geolocation  Local Storage
 Weather   Forecast                 |
    |         |                +-----+------+
    +----+----+                |            |
         |                  Favourites   Preferences
         v                  and History
    JSON Response
         |
         v
    DOM Manipulation
         |
         v
    UPDATED DASHBOARD
```

## ⚙️ Core Implementation

### 1. REST API Integration

The application communicates with OpenWeatherMap through HTTP requests to retrieve weather information.

**API endpoints:**

```text
GET /data/2.5/weather
GET /data/2.5/forecast
```

The API responses provide weather descriptions, temperature, humidity, wind speed, atmospheric pressure, geographic coordinates, and forecast information.

### 2. Asynchronous JavaScript

The application uses `async/await` and the Fetch API to retrieve external data without blocking user interactions.

Implemented capabilities include:

- Asynchronous HTTP requests
- JSON response parsing
- HTTP status validation
- API error handling
- Loading-state feedback
- Request identification to prevent outdated responses from replacing newer results

### 3. Dynamic Weather Forecast

The five-day forecast is generated dynamically from API response data.

The application groups forecast entries by calendar date, selects a representative forecast entry for each upcoming day, and generates HTML forecast cards using JavaScript DOM methods.

### 4. Browser-Based Data Persistence

The application uses `localStorage` to preserve user preferences between browser sessions.

**Stored preferences:**

```text
weatherFavorites
weatherRecentSearches
weatherTheme
weatherTemperatureUnit
```

This enables persistent favourite cities, recent search history, selected theme, and temperature units without requiring a database.

### 5. Geolocation Integration

The application uses the browser's Geolocation API to obtain geographic coordinates with user permission.

These coordinates are passed to the weather API to retrieve location-specific weather conditions.

### 6. Responsive UI Design

The interface is developed using modern CSS techniques, including:

- Flexbox and CSS Grid layouts
- Responsive media queries
- Gradient backgrounds
- Translucent weather cards
- Dynamic temperature typography
- Dark and light theme styling
- Mobile-friendly weather metrics and forecast cards

## 📂 Project Structure

```text
Weather-Tracker-App/
│
├── index.html        # Application structure
├── style.css         # Responsive styling and themes
├── script.js         # Application logic and API integration
└── README.md         # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- An OpenWeatherMap API key
- Visual Studio Code or another code editor
- An internet connection

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Soumya2-Roy/Weather-Tracker-App.git
```

**2. Navigate to the project directory**

```bash
cd Weather-Tracker-App
```

**3. Configure API access**

Set up a secure backend or serverless API proxy for OpenWeatherMap requests, with the API key stored in an environment variable.

> Security note: The current frontend implementation uses a direct API key. It should be migrated to a serverless proxy before publishing the source code publicly.

**4. Run the application**

Open `index.html` using a local development server, such as the VS Code Live Server extension.

**5. Explore the dashboard**

Search for a city, check its current weather, view the five-day forecast, save favourite cities, and customize display preferences.

## 🧪 Testing and Error Handling

The application includes handling for several scenarios:

| Scenario | Application Behaviour |
|---|---|
| Empty city input | Prevents submission |
| Invalid city name | Displays a city-not-found message |
| Invalid API credentials | Displays an authentication error |
| API rate limit | Displays a request-limit message |
| Location permission denied | Displays an appropriate permission message |
| Geolocation timeout | Displays a timeout notification |
| Forecast request failure | Displays a forecast-unavailable message |
| Local Storage unavailable | Uses fallback handling |

These are implemented application behaviours, not a claim of completed automated test coverage.

## 🧠 Technical Concepts Demonstrated

- Object-oriented browser API usage
- Asynchronous programming
- REST API integration
- JSON processing
- Event-driven application development
- Dynamic DOM manipulation
- Client-side state management
- Persistent browser storage
- Input validation and error handling
- Responsive web design
- Git version control
- Static website deployment

## 📈 Future Enhancements

Potential improvements include:

- Secure serverless API integration
- Automated unit and integration testing
- Weather charts and historical analytics
- Air Quality Index (AQI) monitoring
- Weather alerts and notifications
- Accessibility improvements
- Improved location-aware forecast time handling
- Continuous deployment through GitHub and Netlify

## 🎯 Learning Outcomes

Developing Weather Tracker strengthened my understanding of frontend application development and the integration of external services into interactive web applications.

The project provided practical experience in handling asynchronous operations, transforming API responses into user-friendly interfaces, maintaining persistent client-side preferences, and organizing application functionality into reusable JavaScript functions.

## 👨‍💻 Developer

**Soumya Roy**

B.Tech — Computer Science and Engineering

**GitHub:** https://github.com/Soumya2-Roy

**Live Application:** https://adorable-mochi-06665f.netlify.app/

---

⭐ If you find this project useful, consider starring the repository.

*Built with HTML, CSS, JavaScript, and the OpenWeatherMap API.*
