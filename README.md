# Vehicle Movement Simulation on Map

A frontend-only web application that simulates a vehicle moving along a predefined route on an interactive map.
Built with React, React-Leaflet, and Tailwind CSS — this app visually animates a car moving through real map coordinates using dummy route data.

## Screenshorts
### Desktop View
![App Preview](https://res.cloudinary.com/dblomc9cr/image/upload/v1761671807/Screenshot_2025-10-28_224538_x6mir3.png)
![Cart Preview](https://res.cloudinary.com/dblomc9cr/image/upload/v1761671806/Screenshot_2025-10-28_224517_emyjta.png)

### Mobile View
![App Preview](https://res.cloudinary.com/dblomc9cr/image/upload/v1761671805/Screenshot_2025-10-28_224414_hfcnyc.png)
![Cart Preview](https://res.cloudinary.com/dblomc9cr/image/upload/v1761671804/Screenshot_2025-10-28_224431_onhrik.png)

## Project Structure
```
vehicle-tracker-app/
├── public/
│   └── dummy-route.json         # Static file containing the coordinates
├── src/
│   ├── components/
│   │   └── Controls.jsx         # Bottom controller (Play/Pause, Speed, Config)
│   │   └── InfoCard.jsx         
│   ├── utils                    # Helper functions for speed/distance     
│   ├── VehicleMap.jsx           # Main map logic and vehicle animation
│   ├── App.jsx                  # App entry point
│   └── index.css                # Tailwind styles
├── package.json
├── vite.config.js
└── README.md
```

## Features
Map & Route Visualization
Displays an interactive map (OpenStreetMap via React-Leaflet).
Pre-draws a route line connecting start and end points.
Uses a custom vehicle marker (🚙) that moves smoothly across the route.

## Simulation Controls
Play / Pause / Reset buttons to control the vehicle movement.
Displays current speed, timestamp, and area name (reverse geocoded).
Responsive bottom control panel with day configuration and live stats.

## Real-Time Data Simulation
Fetches coordinates from a static file (dummy-route.json).
Simulates real-time updates with smooth transitions every few seconds.
Automatically animates the traveled path with a dynamic polyline.

## Area Name Display
Uses OpenStreetMap Nominatim Reverse Geocoding API
to fetch and display the current area or street name dynamically.

## Tech Stack
Technology	Purpose
React 19+	Frontend framework
React-Leaflet	Map rendering and interaction
Leaflet.js	Mapping library for tiles, markers, and polylines
Tailwind CSS	UI styling and responsive design
Nominatim API (OSM)	Reverse geocoding to get area names

## Installation & Setup
### 1️⃣ Clone the repository
git clone https://github.com/mounikalingala/vehicle-tracker-mounikaL
cd vehicle-tracker-mounikaL

### 2️⃣ Install dependencies
npm install

### 3️⃣ Run the development server
npm run dev

### 4️⃣ Open in browser

Visit http://localhost:5173

## Dummy Route Data Example

/public/dummy-route.json

[
  { "latitude": 19.9975, "longitude": 73.7890, "timestamp": "2024-07-20T07:00:00Z" },
  { "latitude": 19.9980, "longitude": 73.7893, "timestamp": "2024-07-20T07:00:05Z" },
  { "latitude": 19.9986, "longitude": 73.7899, "timestamp": "2024-07-20T07:00:12Z" },
  { "latitude": 19.9995, "longitude": 73.7906, "timestamp": "2024-07-20T07:00:20Z" },
  { "latitude": 20.0004, "longitude": 73.7915, "timestamp": "2024-07-20T07:00:30Z" },
  { "latitude": 20.0014, "longitude": 73.7923, "timestamp": "2024-07-20T07:00:42Z" },
  { "latitude": 20.0020, "longitude": 73.7929, "timestamp": "2024-07-20T07:00:50Z" }
]


## How It Works
The map initializes centered at the first coordinate.
The full route is drawn in light green before movement begins.
When you press Play, the car marker (🚙) begins moving along the path.
The traveled path appears in green, while the remaining route stays light green.
As the car moves, the bottom panel updates:
Speed (km/h)
Timestamp (Jul 20, 7:00 PM format)
Current area name via reverse geocoding
You can Pause or Reset anytime.

## Reverse Geocoding

The app uses the following endpoint to get the area name:
https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={LAT}&lon={LON}

## Responsive Design
Fully responsive — works smoothly on both desktop and mobile.
UI optimized using Tailwind Flexbox/Grid utilities.

## Live Demo 
[View Live Demo](https://vehicle-tracker-mounikal.netlify.app/)