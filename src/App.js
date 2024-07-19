import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login/Login";
import Server from "./components/Server/Server";
import Company from "./pages/company";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./common/Navbar";
import Sidenav from "./common/SideNav";
import User from "./components/User/User";
import Shops from "./components/Shop/Shop";
import Devices from "./pages/device";
import SpinnerLoader from "./common/SpinnerLoader";
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndServer = async () => {
      const userDetails = localStorage.getItem("user");
      const serverDetails = localStorage.getItem("serverDetails");
      const loggedIn = userDetails !== null;
      const serverConnected = serverDetails !== null;

      setIsServerConnected(serverConnected);

      // Simulate a delay to show the loader
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!loggedIn) {
        navigate("/login");
      } else if (!serverConnected) {
        navigate("/server");
      } else if (location.pathname === '/') {
        navigate("/companies");
      }

      setIsLoading(false);
    };

    checkAuthAndServer();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6FC276" />
              <stop offset="100%" stopColor="#3F8E4D" />
            </linearGradient>
          </defs>
        </svg>
        <SpinnerLoader />
      </>
    );
  }

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