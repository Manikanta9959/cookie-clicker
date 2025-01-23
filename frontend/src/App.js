import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [counter, setCounter] = useState(0);
  const [prizes, setPrizes] = useState(0);


  useEffect(()=>{
      handleClick();
  }, [token])

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:8001/register", {
        username,
        password,
      });
      alert(response.data.message || response.data.error);
    } catch (error) {
      alert(error)
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8001/login", {
        username,
        password,
      });
      if (response.data.token) {
        setToken(response.data.token);
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      alert(error)
      console.error("Error during login:", error);
    }
  };

  const handleClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8001/click",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { counter, prizes } = response.data;
      setCounter(counter);
      setPrizes(prizes);
    } catch (error) {
      alert(error)
      console.error("Error clicking button:", error);
    }
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
          <button onClick={handleRegister} style={{ marginRight: "10px" }}>
            Register
          </button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>Counter: {counter}</p>
          <p>Prizes: {prizes}</p>
          <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Click Me!
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
