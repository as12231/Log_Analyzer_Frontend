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
  const chars = "1";
  let captcha = "";
  for (let i = 0; i < 1; i++) {
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
      setUserCaptcha("");
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard/workouts");
      } else {
        setError(data.message || "❌ Login failed.");
        setCaptcha(generateCaptcha());
        setUserCaptcha("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("❌ Something went wrong. Please try again.");
      setCaptcha(generateCaptcha());
      setUserCaptcha("");
    }
  };

  // Define green color palette variables
  const greenDark = "#1f4037";
  const greenLight = "#99f2c8";
  const greenMedium = "#4caf50";
  const greenHover = "#388e3c";
  const inputBorderColor = "#4caf5080";

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${greenDark}, ${greenLight})`,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          color: greenLight,
          background: "rgba(0, 0, 0, 0.3)",
          textShadow: `0 0 10px ${greenDark}`,
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={2} textAlign="center">
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 400, textAlign: "center", opacity: 0.85 }}
        >
          Log in to your account and start analyzing your logs with powerful
          filters and real-time insights.
        </Typography>
      </Grid>

      {/* Right panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            boxShadow:
              `0 6px 20px ${greenMedium}aa, 0 8px 30px ${greenDark}bb`,
            border: `1px solid ${greenMedium}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            mb={4}
            align="center"
            color={greenDark}
          >
            User Login
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: inputBorderColor,
                },
                "&:hover fieldset": {
                  borderColor: greenMedium,
                },
                "&.Mui-focused fieldset": {
                  borderColor: greenMedium,
                  boxShadow: `0 0 8px ${greenMedium}aa`,
                },
              },
            }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: inputBorderColor,
                },
                "&:hover fieldset": {
                  borderColor: greenMedium,
                },
                "&.Mui-focused fieldset": {
                  borderColor: greenMedium,
                  boxShadow: `0 0 8px ${greenMedium}aa`,
                },
              },
            }}
          />

          <Box
            sx={{
              my: 3,
              py: 1.5,
              textAlign: "center",
              fontSize: 26,
              fontWeight: 700,
              backgroundColor: greenLight,
              borderRadius: 2,
              userSelect: "none",
              color: greenDark,
              border: `2px solid ${greenMedium}`,
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: 8,
              cursor: "default",
              boxShadow: `0 0 8px ${greenMedium}55`,
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
            inputProps={{ style: { letterSpacing: "0.2em" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: inputBorderColor,
                },
                "&:hover fieldset": {
                  borderColor: greenMedium,
                },
                "&.Mui-focused fieldset": {
                  borderColor: greenMedium,
                  boxShadow: `0 0 8px ${greenMedium}aa`,
                },
              },
            }}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1} textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.8,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${greenDark}, ${greenMedium})`,
              fontWeight: "bold",
              boxShadow: `0 4px 15px ${greenMedium}88`,
              transition: "background 0.3s ease",
              "&:hover": {
                background: `linear-gradient(45deg, ${greenMedium}, ${greenHover})`,
                boxShadow: `0 6px 20px ${greenHover}cc`,
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            fontSize="0.9rem"
            color={greenMedium}
          >
            <Link href="#" underline="hover" sx={{ color: greenMedium }}>
              Forgot Password?
            </Link>
            <Link href="/signup" underline="hover" sx={{ color: greenMedium }}>
              Signup
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
