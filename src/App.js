import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";

const App = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        const data = await res.json();
        setEarthquakes(data.features);
        setLoading(false);
      } catch (err) {
        setError("Failed to load earthquake data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <h1 className="title">🌎 Earthquake Visualizer</h1>
      <MapContainer center={[20, 0]} zoom={2} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {earthquakes.map((eq) => {
          const [lon, lat, depth] = eq.geometry.coordinates;
          const mag = eq.properties.mag;
          return (
            <CircleMarker
              key={eq.id}
              center={[lat, lon]}
              radius={mag * 2}
              fillColor={mag >= 5 ? "red" : mag >= 3 ? "orange" : "yellow"}
              color="#000"
              weight={1}
              fillOpacity={0.8}
            >
              <Popup>
                <strong>{eq.properties.place}</strong>
                <br />
                Magnitude: {mag}
                <br />
                Depth: {depth} km
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default App;
