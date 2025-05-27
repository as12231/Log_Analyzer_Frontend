import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Input,
  Divider,
  Snackbar,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [insights, setInsights] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // New chat related states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setInsights(null);
      setShowOptions(false);
      setShowChat(false);
      setChatMessages([]);
      setChatInput("");
    }
  };

  const handleProcessFile = async () => {
    const input = document.getElementById("fileInput");
    if (!input.files.length) return;

    const formData = new FormData();
    formData.append("logfile", input.files[0]);

    try {
      const response = await fetch("http://localhost:5000/auth/upload_log", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.structuredInsights) {
        setInsights(data.structuredInsights);
      } else {
        setInsights(null);
      }

      setSnackbar({
        open: true,
        message: data.message || "No message from server",
        severity: data.success ? "success" : "error",
      });

      setShowOptions(true);
      setShowChat(false);
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
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);

    try {
      const response = await fetch("http://localhost:5000/auth/ask", {
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

  const InsightsDisplay = ({ insights }) => {
    if (!insights) return null;

    return (
      <Paper
        elevation={6}
        sx={{ p: 3, mt: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <Typography variant="h5" gutterBottom>
          🔍 Insights from Log File
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Frequent Error Types:
        </Typography>
        <ul>
          {insights.frequentErrorTypes?.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Most Active Time Range:
        </Typography>
        <Typography>{insights.mostActiveTimeRange}</Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Log Level Distribution:
        </Typography>
        <ul>
          {insights.logLevelDistribution &&
            Object.entries(insights.logLevelDistribution).map(([level, count]) => (
              <li key={level}>
                {level}: {count}
              </li>
            ))}
        </ul>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Common Messages:
        </Typography>
        <ul>
          {insights.commonMessages?.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Recommendations:
        </Typography>
        <ul>
          {insights.recommendations?.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </Paper>
    );
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
      }}
    >
      <Container maxWidth="md" sx={{ flexGrow: 1, pr: showChat ? 2 : 0 }}>
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
            mb: 2,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <UploadFileIcon sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Click to upload your .log file
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
        </Paper>

        {!showOptions && fileName && (
          <Button
            variant="contained"
            sx={{ display: "block", mx: "auto", mb: 4 }}
            onClick={handleProcessFile}
          >
            Process File
          </Button>
        )}

        {showOptions && (
          <Box sx={{ my: 3, textAlign: "center" }}>
            <Button variant="outlined" onClick={() => setShowChat(true)} sx={{ mr: 2 }}>
              Chat
            </Button>

            {/* Navigate to "Summary" */}
            <Button variant="outlined" onClick={() => navigate("/y")} sx={{ mr: 2 }}>
              Summary
            </Button>

            {/* Navigate to "Insights" - next tab */}
            <Button variant="outlined" onClick={() => navigate("/x")} sx={{ mr: 2 }}>
              Insights
            </Button>

            {/* Navigate to "History Insights" */}
            <Button variant="outlined" onClick={() => navigate("/history")} sx={{ mr: 2 }}>
              History Insights
            </Button>
          </Box>
        )}

        {insights && !showChat && <InsightsDisplay insights={insights} />}

        {showChat && (
          <Paper
            elevation={6}
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" gutterBottom>
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
              placeholder="Ask something..."
              variant="filled"
              sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 1 }}
            />

            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{ mt: 1, float: "right" }}
            >
              Send
            </Button>
          </Paper>
        )}
        <Typography variant="h5" sx={{ mb: 3, mt: 6 }}>
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
      
        

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
    </>
  );
};

export default LandingPage;
