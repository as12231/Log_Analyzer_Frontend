import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Input,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const apiUrl = process.env.REACT_APP_API_URL;
  const [showSummary, setShowSummary] = useState(false);
  const [insights, setInsights] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setInsights(null);
      setShowOptions(false);
      setShowChat(false);
      setShowSummary(false);
      setChatMessages([]);
      setChatInput("");
    }
  };

  const handleProcessFile = async () => {
    const input = document.getElementById("fileInput");
    if (!input.files.length) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("logfile", input.files[0]);
    try {
      const response = await fetch(`${apiUrl}/auth/upload_log`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        // Strip markdown asterisks from summary
        const cleanSummary = data.summary
          ? data.summary.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "")
          : "No summary provided";
        setInsights({ summary: cleanSummary });
        setSnackbar({
          open: true,
          message: data.message || "Log file uploaded successfully",
          severity: "success",
        });
        setShowOptions(true);
        setShowSummary(true); // Show Summary by default
      } else {
        setInsights(null);
        setSnackbar({
          open: true,
          message: data.message || "Failed to process file",
          severity: "error",
        });
        setShowOptions(false);
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setSnackbar({
        open: true,
        message: "Network or server error",
        severity: "error",
      });
      setInsights(null);
      setShowOptions(false);
      setShowChat(false);
      setShowSummary(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setInsights(null);
    setShowOptions(false);
    setShowChat(false);
    setShowSummary(false);
    setChatMessages([]);
    setChatInput("");
    document.getElementById("fileInput").value = null;
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);

    try {
      const response = await fetch(`${apiUrl}/auth/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: chatInput }),
      });

      const data = await response.json();

      if (data.success && data.answer) {
        setChatMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { from: "bot", text: "Sorry, I couldn't get a valid answer." },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        { from: "bot", text: "Network or server error while sending message." },
      ]);
    }
    setChatInput("");
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "white",
          py: 8,
          position: "relative",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            borderColor: "rgba(255,255,255,0.5)",
            borderRadius: 8,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255,255,255,0.2)",
              transform: "scale(1.05)",
              transition: "all 0.3s ease",
            },
          }}
        >
          Logout
        </Button>

        <Container maxWidth="md" sx={{ flexGrow: 1, zIndex: 1 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: 1,
            }}
          >
            📊 Log Analyzer Platform
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 5,
              color: "rgba(255,255,255,0.8)",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Upload your server or application log files to uncover deep insights with our advanced analytics and visualization tools.
          </Typography>

          <Paper
            elevation={8}
            sx={{
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 3,
              mb: 2,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              },
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <UploadFileIcon sx={{ fontSize: 50, mb: 2, color: "#90caf9" }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
              Please Upload your log File
            </Typography>
            <Input
              id="fileInput"
              type="file"
              inputProps={{ accept: ".log" }}
              onChange={handleFileChange}
              sx={{ display: "none" }}
            />
            {fileName && (
              <Typography sx={{ mt: 2, fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>
                Selected File: {fileName}
              </Typography>
            )}
          </Paper>

          {fileName && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                onClick={handleProcessFile}
                disabled={isProcessing}
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                  "&:disabled": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                    Processing...
                  </>
                ) : (
                  "Process File"
                )}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          )}

          {showOptions && (
            <Box sx={{ my: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              {[ "Summary","Chat", "Insights", "History Insights"].map((label) => (
                <Button
                  key={label}
                  variant={showSummary && label === "Summary" ? "contained" : showChat && label === "Chat" ? "contained" : "outlined"}
                  onClick={() => {
                    if (label === "Chat") {
                      setShowChat(true);
                      setShowSummary(false); // Hide Summary when Chat is clicked
                    } else if (label === "Summary") {
                      setShowSummary(true);
                      setShowChat(false); // Hide Chat when Summary is clicked
                    } else if (label === "Insights") {
                      window.open("/log_insights", "_blank");
                    } else {
                      window.open("/history_insights", "_blank");
                    }
                  }}
                  sx={{
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.5)",
                    backgroundColor:
                      (showSummary && label === "Summary") || (showChat && label === "Chat")
                        ? "#1976d2"
                        : "transparent",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease",
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          {showSummary && !showChat && (
            <Paper
              elevation={6}
              sx={{
                p: 3,
                mt: 2,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 2,
                backdropFilter: "blur(5px)",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                📝 Summary
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.9)" }}>
                {insights?.summary || "No summary available."}
              </Typography>
            </Paper>
          )}

          {showChat && (
            <Paper
              elevation={6}
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 2,
                maxHeight: "60vh",
                overflowY: "auto",
                backdropFilter: "blur(5px)",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                🤖 Chat with Insights Bot
              </Typography>
              <Box
                sx={{
                  maxHeight: "40vh",
                  overflowY: "auto",
                  mb: 2,
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              >
                {chatMessages.length === 0 && (
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                    Start by asking questions about your log file.
                  </Typography>
                )}
                {chatMessages.map((msg, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    sx={{
                      mb: 1,
                      color: msg.from === "user" ? "#a5d6a7" : "#90caf9",
                      fontWeight: msg.from === "user" ? "bold" : "normal",
                    }}
                  >
                    <strong>{msg.from === "user" ? "You:" : "Bot:"}</strong> {msg.text}
                  </Typography>
                ))}
              </Box>

              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Ask something like 'What are the most common errors?'"
                sx={{
                  input: { color: "white" },
                  textarea: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
                  },
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Paper>
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LandingPage;