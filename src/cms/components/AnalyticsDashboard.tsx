/**
 * Analytics Dashboard Component
 * 
 * This component displays analytics and metrics for the Cardano Kids platform,
 * including content engagement, user progress, and blockchain interactions.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
// Mock recharts components for TypeScript compatibility
// In a real project, you would install the recharts package with: npm install recharts @types/recharts
const LineChart = (props: any) => <div {...props} />;
const Line = (props: any) => <div {...props} />;
const BarChart = (props: any) => <div {...props} />;
const Bar = (props: any) => <div {...props} />;
const PieChart = (props: any) => <div {...props} />;
const Pie = (props: any) => <div {...props} />;
const Cell = (props: any) => <div {...props} />;
const XAxis = (props: any) => <div {...props} />;
const YAxis = (props: any) => <div {...props} />;
const CartesianGrid = (props: any) => <div {...props} />;
const Tooltip = (props: any) => <div {...props} />;
const Legend = (props: any) => <div {...props} />;
const ResponsiveContainer = (props: any) => <div {...props} />;

// Mock data for charts
const contentViewsData = [
  { name: 'Jan', views: 400 },
  { name: 'Feb', views: 300 },
  { name: 'Mar', views: 600 },
  { name: 'Apr', views: 800 },
  { name: 'May', views: 1000 },
  { name: 'Jun', views: 1200 },
  { name: 'Jul', views: 1500 }
];

const contentTypeData = [
  { name: 'Lessons', value: 45 },
  { name: 'Videos', value: 25 },
  { name: 'Quizzes', value: 15 },
  { name: 'Simulations', value: 10 },
  { name: 'Games', value: 5 }
];

const ageGroupEngagementData = [
  { name: 'Young (6-8)', lessons: 30, quizzes: 15, videos: 40 },
  { name: 'Middle (9-11)', lessons: 40, quizzes: 30, videos: 35 },
  { name: 'Older (12-14)', lessons: 50, quizzes: 45, videos: 30 }
];

const achievementsData = [
  { name: 'Course Completion', count: 120 },
  { name: 'Quiz Mastery', count: 85 },
  { name: 'Blockchain Explorer', count: 60 },
  { name: 'Content Creator', count: 25 },
  { name: 'Community Helper', count: 15 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

/**
 * Analytics Dashboard Component
 */
const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Analytics Dashboard</Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container spacing={3} component="div">
        {/* Key Metrics */}
        <Grid item xs={12} md={3} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Users</Typography>
              <Typography variant="h3">1,245</Typography>
              <Typography variant="body2" color="text.secondary">
                +12% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Content Views</Typography>
              <Typography variant="h3">8,721</Typography>
              <Typography variant="body2" color="text.secondary">
                +24% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Achievements Earned</Typography>
              <Typography variant="h3">305</Typography>
              <Typography variant="body2" color="text.secondary">
                +8% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Blockchain Interactions</Typography>
              <Typography variant="h3">1,892</Typography>
              <Typography variant="body2" color="text.secondary">
                +15% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Content Views Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Content Views Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={contentViewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Content Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Content Type Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Age Group Engagement */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Engagement by Age Group</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ageGroupEngagementData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="lessons" fill="#8884d8" name="Lessons" />
                <Bar dataKey="quizzes" fill="#82ca9d" name="Quizzes" />
                <Bar dataKey="videos" fill="#ffc658" name="Videos" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Top Achievements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Achievements Earned</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={achievementsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Blockchain Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Blockchain Metrics</Typography>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Total Transactions:</strong> 2,456
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>NFT Achievements Minted:</strong> 305
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>Content Metadata Records:</strong> 142
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>Average Transaction Fee:</strong> 0.17 ADA
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>Unique Wallets Connected:</strong> 876
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
