import React from "react";
import { FaUser, FaLock  } from "react-icons/fa";
import { Link } from "react-router-dom";

function LoginForm() {
    return (
     <div className="body-login-form">
      <div className="wrapper">
          <form action="">
            <h1>Sign In</h1>
            <div className="input-box">
                <FaUser className="icon"/>
                <input type="text" placeholder="Username" required/>
            </div>

            <div className="input-box">
                <FaLock className="icon"/>
                <input type="password" placeholder="Password" required/>
            </div>

            <div className="remember-forgot">
                <label><input type="checkbox"/>Remember Me</label>
                <a href="#">Forgot Password?</a>
            </div>

            <Link to="/server">
                <button type="submit">Login</button>
            </Link>

          </form>
          </div>
      </div>
    );
  }
  
  export default LoginForm;
  