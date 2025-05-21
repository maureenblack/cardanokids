import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Person,
  Edit,
  Delete,
  Add,
  AccessTime,
  Security,
  School,
  Download,
  BarChart,
  Settings,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `parent-tab-${index}`,
    'aria-controls': `parent-tabpanel-${index}`,
  };
}

const ParentDashboardPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [contentFilters, setContentFilters] = useState({
    advancedConcepts: true,
    financialTopics: false,
    externalLinks: true,
  });

  // Sample data for child accounts
  const childAccounts = [
    {
      id: 'child1',
      name: 'Alex',
      age: 8,
      progress: 65,
      modules: [
        { id: 'digital-treasures', title: 'Digital Treasures', progress: 100, completed: true },
        { id: 'blockchain-basics', title: 'Blockchain Basics', progress: 60, completed: false },
        { id: 'smart-contracts', title: 'Smart Contracts', progress: 30, completed: false },
      ],
      timeSpent: {
        thisWeek: 120, // minutes
        average: 100, // minutes per week
      },
      achievements: 5,
    },
    {
      id: 'child2',
      name: 'Maya',
      age: 12,
      progress: 42,
      modules: [
        { id: 'digital-treasures', title: 'Digital Treasures', progress: 80, completed: false },
        { id: 'blockchain-basics', title: 'Blockchain Basics', progress: 40, completed: false },
        { id: 'smart-contracts', title: 'Smart Contracts', progress: 0, completed: false },
      ],
      timeSpent: {
        thisWeek: 90, // minutes
        average: 85, // minutes per week
      },
      achievements: 3,
    },
  ];

  // Sample data for learning resources
  const learningResources = [
    {
      id: 'resource1',
      title: 'Blockchain for Parents: A Guide',
      type: 'PDF',
      description: 'A comprehensive guide to understanding blockchain concepts that your child is learning.',
      url: '#',
    },
    {
      id: 'resource2',
      title: 'How to Discuss Digital Ownership',
      type: 'Video',
      description: 'Tips for discussing blockchain concepts with your child in an age-appropriate way.',
      url: '#',
    },
    {
      id: 'resource3',
      title: 'Family Activities: Blockchain Edition',
      type: 'PDF',
      description: 'Fun family activities that reinforce blockchain learning concepts.',
      url: '#',
    },
  ];

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle time limit change
  const handleTimeLimitChange = (event: Event, newValue: number | number[]) => {
    setTimeLimit(newValue as number);
  };

  // Handle content filter change
  const handleContentFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentFilters({
      ...contentFilters,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Dashboard Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Parent Dashboard
            </Typography>
            <Typography variant="h6">
              Monitor your child's learning journey and manage content settings
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                bgcolor: 'white',
                color: theme.palette.secondary.main,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Add Child Account
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Dashboard Tabs */}
      <Paper sx={{ borderRadius: 4, mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="parent dashboard tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
            },
          }}
        >
          <Tab icon={<Person />} label="Child Accounts" {...a11yProps(0)} />
          <Tab icon={<Settings />} label="Content Settings" {...a11yProps(1)} />
          <Tab icon={<AccessTime />} label="Time Management" {...a11yProps(2)} />
          <Tab icon={<School />} label="Learning Resources" {...a11yProps(3)} />
        </Tabs>

        {/* Child Accounts Tab */}
        <TabPanel value={tabValue} index={0}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              {childAccounts.map((child) => (
                <Grid key={child.id} size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {child.name.charAt(0)}
                        </Avatar>
                      }
                      title={`${child.name} (${child.age} years old)`}
                      subheader={`Overall Progress: ${child.progress}%`}
                      action={
                        <IconButton aria-label="edit child">
                          <Edit />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Learning Progress
                      </Typography>
                      <List>
                        {child.modules.map((module) => (
                          <ListItem key={module.id} disablePadding sx={{ mb: 2 }}>
                            <ListItemText
                              primary={module.title}
                              secondary={
                                <Box sx={{ width: '100%', mt: 1 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">{module.progress}%</Typography>
                                    {module.completed && (
                                      <Chip
                                        label="Completed"
                                        size="small"
                                        color="success"
                                        sx={{ height: 20 }}
                                      />
                                    )}
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={module.progress}
                                    sx={{ height: 8, borderRadius: 4 }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Time spent this week
                          </Typography>
                          <Typography variant="h6">
                            {child.timeSpent.thisWeek} minutes
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Achievements earned
                          </Typography>
                          <Typography variant="h6">
                            {child.achievements}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<BarChart />}
                        >
                          Detailed Report
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                        >
                          View Account
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </TabPanel>

        {/* Content Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Content Visibility Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Control what types of content your child can access on the platform.
            </Typography>

            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Advanced Blockchain Concepts"
                      secondary="Allow access to more technical blockchain concepts beyond the basics"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={contentFilters.advancedConcepts}
                        onChange={handleContentFilterChange}
                        name="advancedConcepts"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        {contentFilters.financialTopics ? <Visibility /> : <VisibilityOff />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Financial Topics"
                      secondary="Allow content related to cryptocurrency values and investment concepts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={contentFilters.financialTopics}
                        onChange={handleContentFilterChange}
                        name="financialTopics"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <Security />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="External Links"
                      secondary="Allow access to curated external resources and websites"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={contentFilters.externalLinks}
                        onChange={handleContentFilterChange}
                        name="externalLinks"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
              Age-Appropriate Content
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select which age group content your child can access.
            </Typography>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.success.main,
                        borderWidth: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Young (6-8 years)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Simple explanations with colorful characters and basic activities.
                        </Typography>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Allow access"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.warning.main,
                        borderWidth: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Middle (9-11 years)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          More detailed explanations with interactive examples and activities.
                        </Typography>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Allow access"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.info.main,
                        borderWidth: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Older (12-14 years)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Technical concepts with real-world applications and coding examples.
                        </Typography>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Allow access"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>

        {/* Time Management Tab */}
        <TabPanel value={tabValue} index={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Daily Time Limits
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set how much time your child can spend on the platform each day.
            </Typography>

            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ px: 2 }}>
                  <Typography id="time-limit-slider" gutterBottom>
                    Daily limit: {timeLimit} minutes
                  </Typography>
                  <Slider
                    value={timeLimit}
                    onChange={handleTimeLimitChange}
                    aria-labelledby="time-limit-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={15}
                    max={120}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">15 min</Typography>
                    <Typography variant="body2" color="text.secondary">120 min</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
              Schedule Learning Time
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set specific times when your child can access the platform.
            </Typography>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <AccessTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Weekdays"
                      secondary="Monday to Friday"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="From"
                        type="time"
                        defaultValue="15:00"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 100, mr: 2 }}
                      />
                      <TextField
                        label="To"
                        type="time"
                        defaultValue="18:00"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        <AccessTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Weekends"
                      secondary="Saturday and Sunday"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="From"
                        type="time"
                        defaultValue="10:00"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 100, mr: 2 }}
                      />
                      <TextField
                        label="To"
                        type="time"
                        defaultValue="17:00"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </ListItem>
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">
                    Save Schedule
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>

        {/* Learning Resources Tab */}
        <TabPanel value={tabValue} index={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Parent Resources
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Educational materials to help you understand what your child is learning and how to support them.
            </Typography>

            <Grid container spacing={3}>
              {learningResources.map((resource) => (
                <Grid key={resource.id} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                          <School />
                        </Avatar>
                        <Typography variant="h6">{resource.title}</Typography>
                      </Box>
                      <Chip
                        label={resource.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" paragraph>
                        {resource.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        fullWidth
                      >
                        Download {resource.type}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Discussion Guides
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Guides to help you discuss blockchain concepts with your child.
              </Typography>

              <Card sx={{ borderRadius: 3 }}>
                <List>
                  <ListItem component="a" href="#" sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Explaining Digital Ownership"
                      secondary="Age-appropriate ways to explain NFTs and digital ownership"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="download">
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem component="a" href="#" sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Blockchain in Everyday Life"
                      secondary="Real-world examples of blockchain technology for children"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="download">
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem component="a" href="#" sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Smart Contracts for Kids"
                      secondary="How to explain smart contracts using everyday examples"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="download">
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Card>
            </Box>
          </motion.div>
        </TabPanel>
      </Paper>
    </Container>
  );
};

const Checkbox = ({ defaultChecked }: { defaultChecked?: boolean }) => {
  const [checked, setChecked] = useState(defaultChecked || false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Switch
        checked={checked}
        onChange={handleChange}
        color="primary"
      />
      <Typography variant="body2">
        {checked ? 'Allowed' : 'Blocked'}
      </Typography>
    </Box>
  );
};

export default ParentDashboardPage;
