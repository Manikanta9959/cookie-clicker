import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage
  const [counter, setCounter] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Set Axios default headers for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCounterAndPrizes();
    }
  }, [token]);

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill out both username and password!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/register", {
        username,
        password,
      });
      alert(response.data.message || response.data.error);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill out both username and password!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/login", {
        username,
        password,
      });
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token); // Save token to localStorage
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounterAndPrizes = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/get");
      const { counter, prizes } = response.data;
      setCounter(counter);
      setPrizes(prizes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/click");
      const { counter, prizes } = response.data;
      setCounter(counter);
      setPrizes(prizes);
    } catch (error) {
      console.error("Error clicking button:", error);
      alert("Failed to process the click. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // Remove token from localStorage
    setCounter(0);
    setPrizes(0);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Cookie Clicker with Login</h1>
      {!token ? (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button
            onClick={handleRegister}
            style={{
              padding: "10px 20px",
              marginRight: "5px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            // style={{ marginRight: "10px", padding: "8px 16px" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              marginRight: "5px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            // style={{ padding: "8px 16px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Counter:</strong> {counter}
          </p>
          <p>
            <strong>Prizes:</strong> {prizes}
          </p>
          <button
            onClick={handleClick}
            style={{
              padding: "10px 20px",
              marginRight: "5px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Click Me!"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
