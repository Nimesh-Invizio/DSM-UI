// App.js
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
  const { isLoggedIn, user, onLogout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log(isLoggedIn,"Asaeds");

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const serverDetails = localStorage.getItem("serverDetails");
        if (!serverDetails) {
          navigate("/server");
        }
        

      }, 1000);
    }
  }, [isLoggedIn,navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="App">
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />}
      {isLoggedIn && <Sidenav />}
      <Routes>
        <Route path="/login" element={<Login />} />
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
