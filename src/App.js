import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Server from "./components/Server/Server";
import Company from "./pages/company";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./common/Navbar";
import Sidenav from "./common/SideNav";
import User from "./components/User/User";
import Shops from "./components/Shop/Shop";
import Devices from "./pages/device";

// Protect routes that require authentication and server connection
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user") !== null;
  const isServerConnected = localStorage.getItem("serverDetails") !== null;
  return isAuthenticated && isServerConnected ? children : (isAuthenticated ? <Navigate to="/server" replace /> : <Navigate to="/login" replace />);
};

// Redirect authenticated and connected users from public routes
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user") !== null;
  const isServerConnected = localStorage.getItem("serverDetails") !== null;
  return isAuthenticated && isServerConnected ? <Navigate to="/companies" replace /> : children;
};

const App = () => {
  const { isLoggedIn, user, onLogout } = useContext(AuthContext);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check server connection on mount
    const serverDetails = localStorage.getItem("serverDetails");
    setIsServerConnected(serverDetails !== null);
  }, []);

  // Redirect to appropriate page based on authentication and server connection
  useEffect(() => {
    if (isLoggedIn && !isServerConnected) {
      navigate("/server");
    } else if (isLoggedIn && isServerConnected) {
      navigate(`/companies`);
    }
  }, [isLoggedIn, isServerConnected]);

  return (
    <div className="App">
      {isLoggedIn && <Navbar onLogout={onLogout} user={user} />}
      {isLoggedIn && isServerConnected && <Sidenav />}
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/server" element={<PublicRoute><Server onConnect={() => setIsServerConnected(true)} /></PublicRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Company /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/shops" element={<ProtectedRoute><Shops /></ProtectedRoute>} />
        <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
        <Route path="*" element={
          <Navigate to={
            isLoggedIn
              ? (isServerConnected ? "/companies" : "/server")
              : "/login"
          } replace />
        } />
      </Routes>
    </div>
  );
};

export default App;