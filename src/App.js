import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Server from "./components/Server/Server";
import User from "./components/User/User";
import Shops from "./components/Shop/Shop";
import Sidenav from "./common/SideNav";
import Navbar from "./common/Navbar";
import Devices from "./pages/device";
import { PulseLoader } from "react-spinners";
import Company from "./pages/company";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { isLoggedIn, user, onLogout, checkUserLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      await checkUserLoggedIn();
      setIsLoading(false);
    };

    initializeApp();
  }, [checkUserLoggedIn]);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        const serverDetails = localStorage.getItem("serverDetails");
        if (!serverDetails) {
          navigate("/server");
        }
      } else {
        navigate("/login");
      }
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <PulseLoader color="#6fc276" loading={true} size={20} />
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />}
      {isLoggedIn && <Sidenav />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/server" />} />
        <Route path="/server" element={<Server user={user} />} />
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