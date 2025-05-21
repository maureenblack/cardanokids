import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VerifiedIcon from '@mui/icons-material/Verified';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../../auth/AuthContext';
import { AccountType } from '../../auth/types';
// Import components with explicit file extensions to help TypeScript find them
import ContentList from './ContentList.js';
import ContentVerification from './ContentVerification.js';
import ContentCreator from './ContentCreator.js';
import UserManagement from './UserManagement.js';
import AnalyticsDashboard from './AnalyticsDashboard.js';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const { currentUser, isAuthenticated } = useAuth();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalContent: 0,
    pendingVerification: 0,
    publishedContent: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // In a real implementation, this would fetch dashboard stats from an API
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated stats
        setStats({
          totalContent: 42,
          pendingVerification: 7,
          publishedContent: 28,
          totalUsers: 156
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5">Please log in to access the admin dashboard</Typography>
      </Box>
    );
  }

  // Check if user has admin role
  const isAdmin = currentUser.accountType === AccountType.TEACHER;
  
  if (!isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5">You don't have permission to access this page</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management System
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage educational content, verify accuracy, and publish to the Cardano blockchain
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }} component="div">
          <Grid item xs={12} sm={6} md={3} component="div">
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Content
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center', my: 'auto' }} />
              ) : (
                <Typography variant="h3" sx={{ mt: 'auto' }}>
                  {stats.totalContent}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component="div">
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.contrastText
              }}
            >
              <Typography variant="h6" gutterBottom>
                Pending Verification
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center', my: 'auto' }} />
              ) : (
                <Typography variant="h3" sx={{ mt: 'auto' }}>
                  {stats.pendingVerification}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component="div">
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                bgcolor: theme.palette.success.light,
                color: theme.palette.success.contrastText
              }}
            >
              <Typography variant="h6" gutterBottom>
                Published Content
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center', my: 'auto' }} />
              ) : (
                <Typography variant="h3" sx={{ mt: 'auto' }}>
                  {stats.publishedContent}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component="div">
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                bgcolor: theme.palette.info.light,
                color: theme.palette.info.contrastText
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center', my: 'auto' }} />
              ) : (
                <Typography variant="h3" sx={{ mt: 'auto' }}>
                  {stats.totalUsers}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Tabs */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<DashboardIcon />} label="Dashboard" {...a11yProps(0)} />
              <Tab icon={<LibraryBooksIcon />} label="Content Library" {...a11yProps(1)} />
              <Tab icon={<VerifiedIcon />} label="Content Verification" {...a11yProps(2)} />
              <Tab icon={<PeopleIcon />} label="User Management" {...a11yProps(3)} />
              <Tab icon={<BarChartIcon />} label="Analytics" {...a11yProps(4)} />
            </Tabs>
          </Box>
          
          <TabPanel value={value} index={0}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Welcome to the Cardano Kids CMS
              </Typography>
              
              <Typography variant="body1" paragraph>
                This dashboard allows you to manage educational content for the Cardano Kids platform.
                You can create new content, verify existing content, and publish verified content to the Cardano blockchain.
              </Typography>
              
              <Typography variant="body1" paragraph>
                The content management system integrates with the Cardano blockchain to store content metadata
                and manage access rights through smart contracts. This ensures that educational content is
                verifiably accurate and can be progressively unlocked based on student achievements.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setValue(1)}
                  sx={{ mr: 2 }}
                >
                  View Content Library
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setValue(2)}
                >
                  Verify Content
                </Button>
              </Box>
            </Box>
            
            {/* Quick Actions */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2} component="div">
                <Grid item xs={12} sm={6} md={4} component="div">
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 120,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                    onClick={() => setValue(1)}
                  >
                    <Typography variant="h6" gutterBottom>
                      Create New Content
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Add new educational content to the platform
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} component="div">
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 120,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                    onClick={() => setValue(2)}
                  >
                    <Typography variant="h6" gutterBottom>
                      Verify Pending Content
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Review and verify content for accuracy
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} component="div">
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 120,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                    onClick={() => setValue(4)}
                  >
                    <Typography variant="h6" gutterBottom>
                      View Analytics
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      See content usage and user engagement metrics
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          
          <TabPanel value={value} index={1}>
            <ContentList />
          </TabPanel>
          
          <TabPanel value={value} index={2}>
            <ContentVerification />
          </TabPanel>
          
          <TabPanel value={value} index={3}>
            <UserManagement />
          </TabPanel>
          
          <TabPanel value={value} index={4}>
            <AnalyticsDashboard />
          </TabPanel>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AdminDashboard;
