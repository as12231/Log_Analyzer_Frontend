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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())
      newErrors.name = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email address";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Phone must be 10 digits";
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
        background: "url(https://source.unsplash.com/1600x900/?fitness,gym)",
        backgroundSize: "cover",
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
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h5" fontWeight={600} mb={3} align="center">
                Sign Up
              </Typography>

              {message && (
                <Alert severity={message.includes("✅") ? "success" : "error"} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  name="name"
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    endAdornment:
                      showEmoji.name && (
                        <InputAdornment position="end">
                          <span role="img" aria-label="emoji">😊</span>
                        </InputAdornment>
                      ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    endAdornment:
                      showEmoji.email && (
                        <InputAdornment position="end">
                          <span role="img" aria-label="emoji">📧</span>
                        </InputAdornment>
                      ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  margin="normal"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    endAdornment:
                      showEmoji.phone && (
                        <InputAdornment position="end">
                          <span role="img" aria-label="emoji">📱</span>
                        </InputAdornment>
                      ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  margin="normal"
                  value={formData.age}
                  onChange={handleChange}
                  error={!!errors.age}
                  helperText={errors.age}
                  InputProps={{
                    endAdornment:
                      showEmoji.age && (
                        <InputAdornment position="end">
                          <span role="img" aria-label="emoji">🎂</span>
                        </InputAdornment>
                      ),
                  }}
                />
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
                        {showEmoji.password && (
                          <span role="img" aria-label="emoji">🔒</span>
                        )}
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
                  color="primary"
                  sx={{ mt: 3, borderRadius: 3 }}
                >
                  Create Account
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" color="white" fontWeight={700}>
              🏋️‍♀️ Join the Fitness Revolution
            </Typography>
            <Typography variant="h6" color="white" mt={2}>
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
