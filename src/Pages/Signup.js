import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showEmoji, setShowEmoji] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  // New color scheme
  const colors = {
    bgGradientStart: "#0f4c5c",
    bgGradientEnd: "#38b2ac",
    paperBg: "rgba(255, 255, 255, 0.12)",
    text: "#e0f2f1",
    border: "#4fd1c5",
    buttonBg: "#38b2ac",
    buttonHover: "#2c7a7b",
    error: "#f56565",
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Invalid email address";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.age || formData.age < 12 || formData.age > 100) newErrors.age = "Age must be between 12 and 100";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.length > 0) {
      setShowEmoji({ ...showEmoji, [name]: true });
    } else {
      setShowEmoji({ ...showEmoji, [name]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (validateForm()) {
      try {
        const res = await fetch("http://localhost:5000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.success) {
          setMessage("✅ Signup successful! You can now login.");
          setFormData({
            name: "",
            email: "",
            phone: "",
            age: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setMessage(`❌ ${data.message || "Signup failed"}`);
        }
      } catch (err) {
        console.error("Signup error:", err);
        setMessage("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom right, ${colors.bgGradientStart}, ${colors.bgGradientEnd})`,
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={10}
              sx={{
                p: 4,
                width: "80%",
                maxWidth: 400,
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                backgroundColor: colors.paperBg,
                border: `1.5px solid ${colors.border}`,
                color: colors.text,
                boxShadow: `0 8px 24px ${colors.border}66`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                mb={3}
                align="center"
                sx={{ color: colors.text }}
              >
                Sign Up
              </Typography>

              {message && (
                <Alert
                  severity={message.includes("✅") ? "success" : "error"}
                  sx={{ mb: 2, color: message.includes("✅") ? "green" : colors.error }}
                >
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {["name", "email", "phone", "age"].map((field) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={
                      field === "name"
                        ? "Username"
                        : field === "phone"
                        ? "Phone Number"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    name={field}
                    type={field === "age" ? "number" : "text"}
                    margin="normal"
                    value={formData[field]}
                    onChange={handleChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    InputProps={{
                      endAdornment:
                        showEmoji[field] && (
                          <InputAdornment position="end">
                            {{
                              name: <span role="img" aria-label="emoji">😊</span>,
                              email: <span role="img" aria-label="emoji">📧</span>,
                              phone: <span role="img" aria-label="emoji">📱</span>,
                              age: <span role="img" aria-label="emoji">🎂</span>,
                            }[field]}
                          </InputAdornment>
                        ),
                    }}
                    sx={{
                      input: { color: colors.text },
                      label: { color: colors.text },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: colors.border },
                        "&:hover fieldset": { borderColor: colors.text },
                        "&.Mui-focused fieldset": { borderColor: colors.text },
                      },
                      "& .MuiFormHelperText-root": {
                        color: colors.error,
                      },
                    }}
                  />
                ))}

                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showEmoji.password && <span role="img" aria-label="emoji">🔒</span>}
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: colors.text }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: { color: colors.text },
                    label: { color: colors.text },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: colors.border },
                      "&:hover fieldset": { borderColor: colors.text },
                      "&.Mui-focused fieldset": { borderColor: colors.text },
                    },
                    "& .MuiFormHelperText-root": {
                      color: colors.error,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPassword"
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: colors.text }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: { color: colors.text },
                    label: { color: colors.text },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: colors.border },
                      "&:hover fieldset": { borderColor: colors.text },
                      "&.Mui-focused fieldset": { borderColor: colors.text },
                    },
                    "& .MuiFormHelperText-root": {
                      color: colors.error,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                    backgroundColor: colors.buttonBg,
                    "&:hover": { backgroundColor: colors.buttonHover },
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Create Account
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ color: "#e0f2f1", fontWeight: 700 }}>
              🏋️‍♀️ Join the Fitness Revolution
            </Typography>
            <Typography variant="h6" sx={{ color: "#e0f2f1", mt: 2 }}>
              Real-time tracking, AI fitness plans, social challenges, and more.
              Sign up now and take charge of your health journey.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signup;
