// src/components/Login.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Generate CAPTCHA function
const generateCaptcha = () => {
  const chars = "";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const [name, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (userCaptcha !== captcha) {
      setError("❌ Invalid CAPTCHA. Please try again.");
      setCaptcha(generateCaptcha());
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setError("");
        console.log("✅ Login successful", data);
  
        // Save token in localStorage
        localStorage.setItem("token", data.token); // Save token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // Optionally store user info as well
  
        navigate("/dashboard/workouts"); // Navigate to the dashboard
      } else {
        setError(data.message || "❌ Login failed.");
        setCaptcha(generateCaptcha());
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("❌ Something went wrong. Please try again.");
      setCaptcha(generateCaptcha());
    }
  };
  

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundImage: "url(https://source.unsplash.com/featured/?gym,fitness)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid item xs={12} md={6}></Grid>

      <Grid item xs={12} md={6}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              width: "80%",
              maxWidth: 400,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={3} align="center">
              User Login
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box
              sx={{
                my: 2,
                p: 2,
                textAlign: "center",
                fontSize: 24,
                letterSpacing: 4,
                fontWeight: 700,
                backgroundColor: "#f1f5f9",
                borderRadius: 2,
                userSelect: "none",
              }}
            >
              {captcha}
            </Box>

            <TextField
              label="Enter CAPTCHA"
              variant="outlined"
              fullWidth
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
              onClick={handleLogin}
            >
              Login
            </Button>

            <Box mt={2} display="flex" justifyContent="space-between">
              <Link href="#" variant="body2">
                Forgot Password?
              </Link>
              <Link href="/signup" variant="body2">
                Signup
              </Link>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
