import React, { useState, useEffect, useCallback } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { PulseLoader } from "react-spinners";
import { green, red } from "@mui/material/colors";

const LoginFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
`;

const LoginFormWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 40px;
  max-width: 400px;
  width: 100%;
`;

const LoginFormTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333333;
  font-family: "Montserrat", sans-serif;
`;

const LoginFormInputBox = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const LoginFormInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 20px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
  font-family: "Montserrat", sans-serif;

  &:focus {
    border-color: #6fc276;
  }
`;

const LoginFormIcon = styled(FaUser)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #6fc276;
`;

const RememberForgotContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RememberLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;

  input[type="checkbox"] {
    margin-right: 8px;
  }
`;

const ForgotPasswordLink = styled(Link)`
  color: #6fc276;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginFormButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #6fc276;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "Montserrat", sans-serif;

  &:hover {
    background-color: #5aa864;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LoginForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    if (isLoggedIn && success) {
      window.location.href = "/server";
      console.log("Navigating to /server");
    }
  }, [isLoggedIn, success, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8070/api/v1/auth/login",
        values
      );
  

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSuccess("Login successful!");
        setSnackbarOpen(true);
        setIsLoggedIn(true);


      } else {
        setError("Invalid credentials");
        setSnackbarOpen(true);

      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    const timer = setTimeout(() => {
      setSnackbarOpen(false);
      setError("");
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [snackbarOpen]);

  if (loading) {
    return (
      <LoadingContainer>
        <PulseLoader color="#6fc276" loading={loading} size={20} />
      </LoadingContainer>
    );
  }

  return (
    <LoginFormContainer>
      <LoginFormWrapper>
        <LoginFormTitle>Sign In</LoginFormTitle>
        <form onSubmit={handleSubmit}>
          <LoginFormInputBox>
            <LoginFormInput
              type="text"
              id="email"
              placeholder="Username"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
            <LoginFormIcon />
          </LoginFormInputBox>

          <LoginFormInputBox>
            <LoginFormInput
              type="password"
              id="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
            <LoginFormIcon icon={FaLock} />
          </LoginFormInputBox>

          <RememberForgotContainer>
            <RememberLabel>
              <input type="checkbox" />
              Remember Me
            </RememberLabel>
            <ForgotPasswordLink to="#">Forgot Password?</ForgotPasswordLink>
          </RememberForgotContainer>

          <LoginFormButton type="submit">Login</LoginFormButton>
        </form>
      </LoginFormWrapper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </LoginFormContainer>
  );
}

export default LoginForm;