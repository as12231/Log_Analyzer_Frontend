import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Input,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const LandingPage = () => {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      // You can add file processing logic here
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        py: 8,
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          📊 Log Analytics Platform
        </Typography>

        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 5, color: "rgba(255,255,255,0.7)" }}
        >
          Upload your server or application log files and gain deep insights
          through powerful filtering and visualization tools.
        </Typography>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            mb: 6,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <UploadFileIcon sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Click or drag & drop to upload your .log file
          </Typography>
          <Input
            id="fileInput"
            type="file"
            inputProps={{ accept: ".log,.txt" }}
            onChange={handleFileChange}
            sx={{ display: "none" }}
          />
          {fileName && (
            <Typography sx={{ mt: 2, fontStyle: "italic" }}>
              Selected File: {fileName}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => alert("Upload & process file here!")}
          >
            Process File
          </Button>
        </Paper>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Features:
        </Typography>
        <Grid container spacing={2}>
          {[
            "Filter by Log Level (Error, Warn, Info)",
            "Timestamp range filtering",
            "Search and keyword highlighting",
            "Save parsed data for later analysis",
            "Visual metrics and charts",
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 2,
                }}
              >
                <Typography>{feature}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.3)" }} />

        <Typography
          variant="body2"
          align="center"
          color="rgba(255,255,255,0.5)"
          sx={{ fontStyle: "italic" }}
        >
          © 2025 Log Analytics Inc.
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;
