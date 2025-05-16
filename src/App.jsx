import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const defaultPosition = [13.0605, 80.2255];

const DraggableMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
        },
      }}
    />
  );
};

function App() {
  const [position, setPosition] = useState(defaultPosition);
  const [formData, setFormData] = useState({
    language: "English",
    doors: 1,
    comments: "",
  });

  const handleSubmit = async () => {
    await axios.post("https://your-infinityfree-backend/api/gps", {
      gps: position,
      ...formData,
    });
    alert("Saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <MapContainer center={position} zoom={17} style={{ height: "60vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} setPosition={setPosition} />
      </MapContainer>

      <div style={{ marginTop: 20 }}>
        <label>GPS: {position[0].toFixed(6)}, {position[1].toFixed(6)}</label>
        <br />
        <label>Language</label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          <option>English</option>
          <option>Tamil</option>
        </select>
        <br />
        <label>Number of Doors</label>
        <input
          type="number"
          value={formData.doors}
          onChange={(e) => setFormData({ ...formData, doors: +e.target.value })}
        />
        <br />
        <label>Address Info</label>
        <input
          type="text"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
        />
        <br />
        <button onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default App;
