import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Server from "./components/Server/Server";
import User from "./components/User/User";
import Shop from "./pages/shop";
import Shops from "./components/Shop/Shop";
import Sidenav from "./common/SideNav";
import Navbar from "./common/Navbar";
import Devices from "./pages/device";
import { PulseLoader } from "react-spinners";
import Company from "./pages/company";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        const serverDetails = localStorage.getItem("serverDetails");
        if (serverDetails) {
          navigate("/companies");
        } else {
          navigate("/server");
        }
      }, 1000);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="App">
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />}
      {isLoggedIn && <Sidenav />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/server" /> : <Navigate to="/login" />} />
        <Route
          path="/server"
          element={
            isLoading ? (
              <div className="loading-container">
                <PulseLoader color="#6fc276" loading={isLoading} size={20} />
              </div>
            ) : (
              <Server user={user} />
            )
          }
        />
        <Route path="/companies" element={<Company user={user} />} />
        <Route path="/server/company/:uniqueId" element={<Company user={user} />} />
        <Route path="/server/company/shop/:uniqueId/:id" element={<Shops user={user} />} />
        <Route path="/user" element={<User user={user} />} />
        <Route path="/shops" element={<Shops user={user} />} />
        <Route path="/devices" element={<Devices user={user} />} />
      </Routes>
    </div>
  );
};

export default App;