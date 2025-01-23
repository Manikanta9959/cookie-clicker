import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage
  const [counter, setCounter] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Set Axios default headers for the token (if available)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      handleClick("get"); // Fetch counter and prizes on app load if token exists
    }
  }, [token]);

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Username and password cannot be empty!");
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
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username and password cannot be empty!");
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
        localStorage.setItem("token", response.data.token); // Persist token in localStorage
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (click) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8001/${click}`);
      const { counter, prizes } = response.data;
      setCounter(counter);
      setPrizes(prizes);
    } catch (error) {
      console.error("Error clicking button:", error);
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

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // Clear token from localStorage
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
            style={{ marginRight: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={handleRegister} style={{ marginRight: "10px" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <div>
          <p>Counter: {counter}</p>
          <p>Prizes: {prizes}</p>
          <button onClick={() => {handleClick("click")}} style={{ padding: "10px 20px", fontSize: "16px" }} disabled={loading}>
            {loading ? "Processing..." : "Click Me!"}
          </button>
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
