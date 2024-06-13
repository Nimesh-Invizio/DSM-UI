import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Server from "./components/Server/Server";
import User from "./components/User/User";
import Company from "./components/Company/company";
import Shops from "./components/Shop/Shop";
import Shop from "./pages/shop";
import Sidenav from "./common/SideNav";
import Navbar from "./common/Navbar";
import Devices from "./pages/device";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {isLoggedIn && <Sidenav />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/server" /> : <Login onLogin={handleLogin} />} />
        <Route path="/server" element={isLoggedIn ? <Server /> : <Navigate to="/" />} />
        <Route path="/server/company/:uniqueId" element={isLoggedIn ? <Company /> : <Navigate to="/" />} />
        <Route path="/server/company/shop/:uniqueId/:id" element={isLoggedIn ? <Shops /> : <Navigate to="/" />} />
        <Route path="/user" element={isLoggedIn ? <User /> : <Navigate to="/" />} />
        <Route path="/shops" element={isLoggedIn ? <Shop /> : <Navigate to="/" />} />
        <Route path="/devices" element={isLoggedIn ? <Devices /> : <Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;