import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login"; // Import Login component
import Server from "./components/Server/Server"; // Import Server component
import User from "./components/User/User"; // Import User component
import Company from "./components/Company/company"; // Import Company component
import Shops from "./components/Shop/Shop"; // Import Shops component
import Shop from "./pages/shop"; // Import Shop component
import Sidenav from "./common/SideNav"; // Import SideNav component
import Navbar from "./common/Navbar"; // Import Navbar component
import Devices from "./pages/device"; // Import Devices component
import { PulseLoader } from "react-spinners"; // Import PulseLoader

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true); 
      setTimeout(() => {
        setIsLoading(false);
        navigate("/server");
      }, 1000); 
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="App">
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />}
      {isLoggedIn && <Sidenav />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/server" /> : <Navigate to="/login" />} />
        <Route path="/server" element={
          isLoggedIn ? (
            isLoading ? ( // Display loading indicator while data is fetched
              <div className="loading-container">
                <PulseLoader color="#6fc276" loading={isLoading} size={20} />
              </div>
            ) : (
              <Server user={user} />
            )
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/server/company/:uniqueId" element={isLoggedIn ? <Company user={user} /> : <Navigate to="/login" />} />
        <Route path="/server/company/shop/:uniqueId/:id" element={isLoggedIn ? <Shops user={user} /> : <Navigate to="/login" />} />
        <Route path="/user" element={isLoggedIn ? <User user={user} /> : <Navigate to="/login" />} />
        <Route path="/shops" element={isLoggedIn ? <Shop user={user} /> : <Navigate to="/login" />} />
        <Route path="/devices" element={isLoggedIn ? <Devices user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
