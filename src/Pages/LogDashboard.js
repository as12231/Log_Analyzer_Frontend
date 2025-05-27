
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
    minHeight: 400,
    height: '100%'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total || context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="Log Levels" sx={{ color: 'white' }} />
            <CardContent sx={{ height: 300 }}>
              <Bar data={levelChart} options={barChartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="Log Types" sx={{ color: 'white' }} />
            <CardContent sx={{ height: 300 }}>
              <Pie data={typeChart} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="Keyword Counts (Bar)" sx={{ color: 'white' }} />
            <CardContent sx={{ height: 300 }}>
              <Bar data={keywordChart} options={barChartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader title="Keyword Counts (Pie)" sx={{ color: 'white' }} />
            <CardContent sx={{ height: 300 }}>
              <Pie data={keywordPieChart} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;