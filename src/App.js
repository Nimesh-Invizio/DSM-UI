import React, { useContext, useEffect, useState, useRef } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (isLoggedIn && location.pathname === "/login") {
    return <Navigate to="/companies" replace />;
  }

  return children;
};

const App = () => {
  const { isLoggedIn, user, onLogout, checkUserLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const initRef = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!initRef.current) {
        initRef.current = true;
        await checkUserLoggedIn();
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [checkUserLoggedIn]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      const serverDetails = localStorage.getItem("serverDetails");
      if (!serverDetails) {
        setServerConnected(false);
        navigate("/server");
      } else if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/companies");
      }
    }
  }, [isLoading, isLoggedIn, navigate, location]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <PulseLoader color={"#123abc"} loading={isLoading} size={15} />
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn && <Navbar onLogout={onLogout} user={user} />}
      {isLoggedIn && serverConnected && <Sidenav />}
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route 
          path="/server" 
          element={
            <ProtectedRoute>
              <Server onConnect={() => setServerConnected(true)} />
            </ProtectedRoute>
          } 
        />
        <Route path="/companies" element={<ProtectedRoute><Company /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/shops" element={<ProtectedRoute><Shops /></ProtectedRoute>} />
        <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/companies" : "/login"} replace />} />
      </Routes>
    </div>
  );
};

export default App;