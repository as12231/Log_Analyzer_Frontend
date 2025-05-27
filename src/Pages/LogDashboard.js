import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography
} from '@mui/material';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [activeChart, setActiveChart] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/auth/hist_insights')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('API Error:', err));
  }, []);

  if (!data) {
    return (
      <Box sx={{ backgroundColor: '#0f172a', height: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  const cardStyle = {
    backgroundColor: '#1e293b',
    color: 'white',
    height: 450
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart._metasets?.[0]?.total || context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return ((value / total) * 100).toFixed(1) + '%';
        },
        color: '#fff',
        font: { weight: 'bold' }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const levelChart = {
    labels: Object.keys(data.levelCounts),
    datasets: [{
      label: 'Log Levels',
      data: Object.values(data.levelCounts),
      backgroundColor: '#3b82f6'
    }]
  };

  const typeChart = {
    labels: Object.keys(data.logTypeCounts),
    datasets: [{
      label: 'Log Types',
      data: Object.values(data.logTypeCounts),
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ef4444']
    }]
  };

  const keywordChart = {
    labels: Object.keys(data.keywordCounts),
    datasets: [{
      label: 'Keywords',
      data: Object.values(data.keywordCounts),
      backgroundColor: '#14b8a6'
    }]
  };

  const keywordPieChart = {
    labels: Object.keys(data.keywordCounts),
    datasets: [{
      label: 'Keywords Pie',
      data: Object.values(data.keywordCounts),
      backgroundColor: [
        '#f87171', '#facc15', '#4ade80', '#60a5fa',
        '#c084fc', '#f97316', '#34d399', '#f43f5e'
      ]
    }]
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', mb: 4 }}>
        Log Analysis Dashboard
      </Typography>

      {/* Label Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {['All', 'Log Levels', 'Log Types', 'Keyword Bar', 'Keyword Pie'].map(label => (
          <Box
            key={label}
            onClick={() => setActiveChart(label)}
            sx={{
              cursor: 'pointer',
              backgroundColor: activeChart === label ? '#2563eb' : '#334155',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {(activeChart === 'All' || activeChart === 'Log Levels') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Log Levels"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bar data={levelChart} options={barChartOptions} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Log Types') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Log Types"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={typeChart} options={chartOptions} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Keyword Bar') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Keyword Counts (Bar)"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bar data={keywordChart} options={barChartOptions} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {(activeChart === 'All' || activeChart === 'Keyword Pie') && (
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardHeader
                title="Keyword Counts (Pie)"
                titleTypographyProps={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                sx={{ color: 'white' }}
              />
              <CardContent sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={keywordPieChart} options={chartOptions} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
