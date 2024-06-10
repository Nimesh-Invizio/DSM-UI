import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8070/api/v1/auth/login",
        values
      );
      // Assuming the response contains a token upon successful login
      if (res.data.token) {
        navigate("/server");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="body-login-form">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              id="email"
              placeholder="Username"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
