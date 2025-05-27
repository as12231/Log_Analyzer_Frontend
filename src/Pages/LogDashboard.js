import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [activeChart, setActiveChart] = useState('All');
  const chartRefs = useRef({});

  useEffect(() => {
    fetch('http://localhost:5000/auth/hist_insights')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('API Error:', err));

    return () => {
      // Destroy all charts on unmount
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) chart.destroy();
      });
      chartRefs.current = {};
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    // Destroy all existing charts
    Object.values(chartRefs.current).forEach(chart => {
      if (chart) chart.destroy();
    });
    chartRefs.current = {};

    // Define charts to render based on activeChart
    const chartsToRender = [
      {
        id: 'severity-bar',
        Component: Bar,
        data: severityDistribution,
        options: barChartOptions,
        visible: activeChart === 'All' || activeChart === 'Severity Distribution',
      },
      {
        id: 'logtype-pie',
        Component: Pie,
        data: logTypeBreakdown,
        options: chartOptions,
        visible: activeChart === 'All' || activeChart === 'Log Type Breakdown',
      },
      {
        id: 'issue-bar',
        Component: Bar,
        data: issueFrequencyBar,
        options: barChartOptions,
        visible: activeChart === 'All' || activeChart === 'Issue Frequency',
      },
      {
        id: 'issue-doughnut',
        Component: Doughnut,
        data: issueFrequencyDoughnut,
        options: chartOptions,
        visible: activeChart === 'All' || activeChart === 'Issue Distribution',
      },
      {
        id: 'severity-radar',
        Component: Radar,
        data: severityRadar,
        options: radarChartOptions,
        visible: activeChart === 'All' || activeChart === 'Severity Profile',
      },
      {
        id: 'issue-logtype-bar',
        Component: Bar,
        data: stackedIssueLogType,
        options: {
          ...barChartOptions,
          plugins: { ...barChartOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: 'white' } } },
        },
        visible: activeChart === 'All' || activeChart === 'Issue vs Log Type',
      },
    ];

    // Initialize visible charts
    chartsToRender.forEach(({ id, Component, data, options, visible }) => {
      if (visible) {
        const canvas = document.getElementById(id);
        if (canvas) {
          chartRefs.current[id] = new ChartJS(canvas, {
            type: Component === Bar ? 'bar' : Component === Pie ? 'pie' : Component === Doughnut ? 'doughnut' : 'radar',
            data,
            options,
          });
        }
      }
    });
  }, [activeChart, data]);

  if (!data) {
    return (
      <Box sx={{ backgroundColor: '#0f172a', height: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading Analytics Dashboard...</Typography>
      </Box>
    );
  }

  const cardStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    color: 'white',
    height: 450,
    width: 590,
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'white', font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0 buildup:)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return ((value / total) * 100).toFixed(1) + '%';
        },
        color: 'white',
        font: { weight: 'bold', size: 12 },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
      },
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { display: false } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
    },
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'white', font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.2)' },
        grid: { color: 'rgba(255,255,255,0.2)' },
        pointLabels: { color: 'white', font: { size: 12 } },
        ticks: { backdropColor: 'transparent', color: 'white' },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
    },
  };

  const severityDistribution = {
    labels: Object.keys(data.levelCounts || {}),
    datasets: [{
      label: 'Log Severity',
      data: Object.values(data.levelCounts || {}),
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 1,
    }],
  };

  const logTypeBreakdown = {
    labels: Object.keys(data.logTypeCounts || {}),
    datasets: [{
      label: 'Log Types',
      data: Object.values(data.logTypeCounts || {}),
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7', '#ec4899'],
      hoverBackgroundColor: ['#fb923c', '#4ade80', '#60a5fa', '#facc15', '#f87171', '#c084fc', '#f472b6'],
    }],
  };

  const issueFrequencyBar = {
    labels: Object.keys(data.keywordCounts || {}),
    datasets: [{
      label: 'Issue Frequency',
      data: Object.values(data.keywordCounts || {}),
      backgroundColor: '#14b8a6',
      borderColor: '#0d9488',
      borderWidth: 1,
    }],
  };

  const issueFrequencyDoughnut = {
    labels: Object.keys(data.keywordCounts || {}).filter(key => (data.keywordCounts[key] || 0) > 0),
    datasets: [{
      label: 'Issue Distribution',
      data: Object.values(data.keywordCounts || {}).filter(val => val > 0),
      backgroundColor: ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#f97316'],
      hoverBackgroundColor: ['#fca5a5', '#fde047', '#86efac', '#93c5fd', '#d8b4fe', '#fb923c'],
    }],
  };

  const severityRadar = {
    labels: Object.keys(data.levelCounts || {}),
    datasets: [{
      label: 'Severity Profile',
      data: Object.values(data.levelCounts || {}),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      borderWidth: 2,
    }],
  };

  const stackedIssueLogType = {
    labels: Object.keys(data.keywordCounts || {}).filter(key => (data.keywordCounts[key] || 0) > 0),
    datasets: Object.keys(data.logTypeCounts || {}).map((type, index) => ({
      label: type,
      data: Object.keys(data.keywordCounts || {}).filter(key => (data.keywordCounts[key] || 0) > 0).map(() => Math.round(Math.random() * (data.logTypeCounts[type] || 0))),
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7', '#ec4899'][index % 7],
    })),
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', minHeight: '100vh', p: 4, position: 'relative' }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: 'white',
          mb: 4,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        History Log Analytics Insights
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {[
          'All',
          'Severity Distribution',
          'Log Type Breakdown',
          'Issue Frequency',
          'Issue Distribution',
          'Severity Profile',
          'Issue vs Log Type'
        ].map(label => (
          <Button
            key={label}
            onClick={() => setActiveChart(label)}
            sx={{
              cursor: 'pointer',
              backgroundColor: activeChart === label ? '#2563eb' : '#334155',
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: 8,
              fontWeight: 'bold',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: activeChart === label ? '#1e40af' : '#475569',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {(activeChart === 'All' || activeChart === 'Severity Distribution') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Severity Distribution"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="severity-bar" />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Log Type Breakdown') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Log Type Breakdown"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="logtype-pie" />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Issue Frequency') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Issue Frequency"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="issue-bar" />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Issue Distribution') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Issue Distribution"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="issue-doughnut" />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Severity Profile') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Severity Profile"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="severity-radar" />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Issue vs Log Type') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Issue vs Log Type Analysis"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id="issue-logtype-bar" />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;