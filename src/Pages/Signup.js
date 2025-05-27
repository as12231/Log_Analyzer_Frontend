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
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
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

  // Simplified colors
  const colors = {
    bg: "#e8f0fe", // light ash-blue
    paperBg: "#ffffff",
    text: "#1a202c",
    border: "#90a4ae", // ash
    buttonBg: "#2196f3", // blue
    buttonHover: "#1976d2",
    error: "#f44336",
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Invalid email address";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.age || formData.age < 12 || formData.age > 100)
      newErrors.age = "Age must be between 12 and 100";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowEmoji({ ...showEmoji, [name]: value.length > 0 });
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
          setMessage("✅ Signup successful!");
          setTimeout(() => navigate("/login"), 1500); // navigate after 1.5 seconds
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
    <Box sx={{ minHeight: "100vh", background: colors.bg, py: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                width: "80%",
                maxWidth: 400,
                borderRadius: 3,
                backgroundColor: colors.paperBg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              <Typography variant="h5" fontWeight={600} mb={3} align="center">
                Sign Up
              </Typography>

              {message && (
                <Alert
                  severity={message.includes("✅") ? "success" : "error"}
                  sx={{ mb: 2 }}
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
                      endAdornment: showEmoji[field] && (
                        <InputAdornment position="end">
                          {{
                            name: <span role="img">😊</span>,
                            email: <span role="img">📧</span>,
                            phone: <span role="img">📱</span>,
                            age: <span role="img">🎂</span>,
                          }[field]}
                        </InputAdornment>
                      ),
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
                        {showEmoji.password && <span role="img">🔒</span>}
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
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
            <Typography variant="h3" sx={{ color: colors.text, fontWeight: 700 }}>
              🏋️‍♂️ Ready to Transform?
            </Typography>
            <Typography variant="h6" sx={{ color: colors.text, mt: 2 }}>
              Simple signup. Smarter fitness. Join now and start your journey!
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signup;
