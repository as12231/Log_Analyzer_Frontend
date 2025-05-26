import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalFiles: 0, totalRows: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/auth/all_insights")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          animateCount(data.data.totalFiles, data.data.totalRows);
        }
      });
  }, []);

  const animateCount = (targetFiles, targetRows) => {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const incrementFiles = targetFiles / steps;
    const incrementRows = targetRows / steps;

    const interval = setInterval(() => {
      start++;
      setStats({
        totalFiles: Math.min(Math.floor(incrementFiles * start), targetFiles),
        totalRows: Math.min(Math.floor(incrementRows * start), targetRows)
      });
      if (start >= steps) clearInterval(interval);
    }, stepTime);
  };

  const handleStartMonitoring = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(to bottom right, ${grey[900]}, ${grey[800]})`, color: 'white' }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: grey[950] }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Log Analytics
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: 10, px: 2, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', color: blue[300], mb: 2 }}>Log Analytics</Typography>
        <Typography variant="h6" sx={{ color: grey[300], maxWidth: 700, mx: 'auto', mb: 4 }}>
          Effortless log ingestion, real-time monitoring, and powerful analytics for any kind of system logs — all in one place.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={handleStartMonitoring}>
          Start Monitoring Now
        </Button>
      </Box>

      {/* About Section */}
      <Box sx={{ backgroundColor: grey[900], py: 10 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            What We Do
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: grey[400], mb: 6 }}>
            Log Analytics seamlessly collects and analyzes logs from various sources including:
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { title: "Application Logs", desc: "Supports structured and unstructured logs from any app framework.", color: blue[300] },
              { title: "System Logs", desc: "Track OS-level logs, errors, and system performance metrics.", color: '#66bb6a' },
              { title: "Cloud Logs", desc: "Integrate logs from AWS CloudWatch, GCP, Azure, and more.", color: '#ffeb3b' },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ backgroundColor: grey[800], height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: item.color, fontWeight: 'bold', mb: 1 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: grey[400] }}>{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Stats Section */}
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
  <Card sx={{ backgroundColor: grey[800], p: 6, textAlign: 'center', width: '100%', maxWidth: 700 }}>
    <Grid container spacing={6} justifyContent="center" alignItems="center">
      <Grid item xs={6}>
        <Typography sx={{ fontSize: '3rem', fontWeight: 'bold' }} color={blue[200]}>
          {stats.totalFiles}
        </Typography>
        <Typography sx={{ fontSize: '1.2rem' }} color={grey[400]}>
          Total Files
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ fontSize: '3rem', fontWeight: 'bold' }} color={blue[200]}>
          {stats.totalRows}
        </Typography>
        <Typography sx={{ fontSize: '1.2rem' }} color={grey[400]}>
          Total Rows
        </Typography>
      </Grid>
    </Grid>
  </Card>
</Box>


          {/* Sample Credentials Section */}
          {/* <Box sx={{ mt: 10, p: 4, backgroundColor: grey[800], borderRadius: 2 }}>
            <Typography variant="h6" color={blue[200]} gutterBottom>
              Sample Credentials
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box>
                <Typography variant="subtitle2" color={grey[400]}>Admin</Typography>
                <Typography variant="body2" color={grey[400]}>Username: admin@example.com</Typography>
                <Typography variant="body2" color={grey[400]}>Password: admin123</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color={grey[400]}>Guest</Typography>
                <Typography variant="body2" color={grey[400]}>Username: guest@example.com</Typography>
                <Typography variant="body2" color={grey[400]}>Password: guest123</Typography>
              </Box>
            </Box>
          </Box> */}



        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: grey[900], py: 3, textAlign: 'center', color: grey[500] }}>
        © 2025 Log Analytics. Built with 💻 by your team.
      </Box>
    </Box>
  );
}
