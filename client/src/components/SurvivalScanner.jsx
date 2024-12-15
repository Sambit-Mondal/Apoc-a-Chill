import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContextFile";

const SurvivalScanner = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertLevel, setAlertLevel] = useState("Low");
  const [position, setPosition] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [webhookTriggered, setWebhookTriggered] = useState(false); // Track webhook state
  const [cooldown, setCooldown] = useState(false); // Add cooldown state

  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const socket = useRef(null);

  // Function to send data to the backend
  const sendLocationData = useCallback((level, pos = position) => {
    if (!pos) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        latitude: pos.latitude,
        longitude: pos.longitude,
        alertLevel: level,
      }),
    }).catch((err) => console.error("Error sending data:", err));
  }, [position, userEmail]);

  // Function to fetch the user's location and trigger the webhook
  const fetchLocation = useCallback(() => {
    if (webhookTriggered || cooldown) {
      console.log("Webhook already triggered or on cooldown. Skipping request.");
      return; // Prevent duplicate requests
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition({ latitude, longitude });
        sendLocationData(alertLevel, { latitude, longitude });

        // Trigger webhook for SOS alert
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/webhook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alertMessage: "Emergency! Immediate assistance needed.",
            latitude,
            longitude,
            alertLevel,
          }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Webhook triggered successfully!");
              setWebhookTriggered(true); // Mark the webhook as triggered
              setCooldown(true); // Enable cooldown
              setTimeout(() => setCooldown(false), 30000); // Reset cooldown after 30 seconds
            } else {
              console.error("Failed to trigger webhook:", response.statusText);
            }
          })
          .catch((err) => console.error("Error triggering webhook:", err));
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, [alertLevel, sendLocationData, webhookTriggered, cooldown]);

  // Custom hook to move the map to the user's position
  const MoveMapToUser = ({ position }) => {
    MoveMapToUser.propTypes = {
      position: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    };

    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView([position.latitude, position.longitude], 15);
      }
    }, [position, map]);
    return null;
  };

  // Handle WebSocket updates
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_URL);
    socket.current.on("update_users", (users) => {
      setAllUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Dropdown handlers
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleOptionClick = (level) => {
    setAlertLevel(level);
    setDropdownOpen(false);
    if (position) {
      sendLocationData(level);
    }
  };

  // Handle click outside dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: User is not logged in!</p>
      </div>
    );
  }

  return (
    <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue rounded-md px-3 py-2">
      <div className="w-full relative h-[85%] border-2 border-mlsa-sky-blue rounded-md">
        <MapContainer
          center={position ? [position.latitude, position.longitude] : [0, 0]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {position && (
            <>
              <Circle
                center={[position.latitude, position.longitude]}
                radius={5000}
                pathOptions={{ color: alertLevel === "High" ? "red" : "green" }}
              />
              <Marker position={[position.latitude, position.longitude]}>
                <Popup>Your Location</Popup>
              </Marker>
            </>
          )}
          {allUsers.map((user, index) => (
            <Marker key={index} position={[user.latitude, user.longitude]}>
              <Popup>
                {user.email} ({user.alertLevel})
              </Popup>
            </Marker>
          ))}
          <MoveMapToUser position={position} />
        </MapContainer>
      </div>
      <div className="flex items-center justify-center w-full h-[15%] gap-5">
        <div className="flex items-center w-[70%] h-[15%] gap-3 text-white font-bold">
          Choose the level of danger in your area right now:
          <div className="relative w-[30%] text-white" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center justify-between border-2 rounded-md border-mlsa-sky-blue bg-transparent py-1 px-2 w-full text-left font-medium text-white outline-none cursor-pointer"
            >
              <span>{alertLevel}</span>
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-1 w-full text-center font-semibold border-2 border-mlsa-sky-blue bg-black rounded-md shadow-lg py-1 z-20">
                {["High", "Low"].map((alert) => (
                  <div
                    key={alert}
                    onClick={() => handleOptionClick(alert)}
                    className="block px-4 py-1 text-sm hover:bg-mlsa-sky-blue hover:text-black cursor-pointer"
                  >
                    {alert}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            cooldown ? "bg-gray-500" : "bg-red-500"
          } rounded-full w-10 h-10 flex items-center justify-center text-white font-bold p-2 cursor-pointer`}
          onClick={fetchLocation}
          disabled={cooldown} // Disable during cooldown
        >
          SOS
        </div>
      </div>
    </div>
  );
};

SurvivalScanner.propTypes = {
  userEmail: PropTypes.string,
};
SurvivalScanner.defaultProps = {
  userEmail: null,
};

export default SurvivalScanner;