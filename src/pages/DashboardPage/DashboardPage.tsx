import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  EmojiEvents,
  School,
  TrendingUp,
  PlayArrow,
  Bookmark,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useAgeGroup } from '../../context/AgeGroupContext';

const DashboardPage = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();

  // Mock data for learning modules
  const modules = [
    {
      id: 'digital-treasures',
      title: 'Digital Treasures',
      description: 'Learn about digital ownership and how blockchain keeps track of who owns what.',
      image: 'https://via.placeholder.com/300x200?text=Digital+Treasures',
      progress: 75,
      completed: false,
    },
    {
      id: 'blockchain-basics',
      title: 'Blockchain Basics',
      description: "Discover how blockchain works and why it's special.",
      image: 'https://via.placeholder.com/300x200?text=Blockchain+Basics',
      progress: 40,
      completed: false,
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts',
      description: "Explore how smart contracts work like digital promises that can't be broken.",
      image: 'https://via.placeholder.com/300x200?text=Smart+Contracts',
      progress: 10,
      completed: false,
    },
    {
      id: 'decentralization',
      title: 'Decentralization',
      description: 'Learn why having no central control makes blockchain special.',
      image: 'https://via.placeholder.com/300x200?text=Decentralization',
      progress: 0,
      completed: false,
    },
  ];

  // Mock data for achievements
  const achievements = [
    {
      id: 'first-login',
      title: 'First Steps',
      description: 'Logged into Cardano Kids for the first time',
      icon: <EmojiEvents />,
      date: '2023-05-15',
      unlocked: true,
    },
    {
      id: 'module-complete',
      title: 'Knowledge Seeker',
      description: 'Completed your first learning module',
      icon: <School />,
      date: '2023-05-16',
      unlocked: true,
    },
    {
      id: 'streak-week',
      title: 'Consistency Champion',
      description: 'Logged in for 7 days in a row',
      icon: <TrendingUp />,
      date: null,
      unlocked: false,
    },
  ];

  // Calculate overall progress
  const overallProgress = modules.reduce((sum, module) => sum + module.progress, 0) / modules.length;

  // Get color based on age group
  const getAgeGroupColor = () => {
    return theme.palette[ageGroup].main;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette[ageGroup].light} 0%, ${theme.palette[ageGroup].main} 100%)`,
            color: theme.palette[ageGroup].contrastText,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Your Learning Dashboard
              </Typography>
              <Typography variant="h6">
                Track your progress and continue your blockchain adventure!
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom>
                  {Math.round(overallProgress)}%
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={overallProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Learning Modules Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Your Learning Modules
        </Typography>
        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid key={module.id} size={{ xs: 12, sm: 6, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 140 }}
                    image={module.image}
                    alt={module.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography component="h3" variant="h6">
                          {module.title}
                        </Typography>
                        <Chip
                          label={`${module.progress}%`}
                          size="small"
                          sx={{
                            backgroundColor: getAgeGroupColor(),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {module.description}
                      </Typography>
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={module.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getAgeGroupColor(),
                            },
                          }}
                        />
                      </Box>
                      <Button
                        component={RouterLink}
                        to={`/learning/${module.id}`}
                        variant="contained"
                        startIcon={<PlayArrow />}
                        size="small"
                        sx={{
                          backgroundColor: getAgeGroupColor(),
                          '&:hover': {
                            backgroundColor: theme.palette[ageGroup].dark,
                          },
                        }}
                      >
                        {module.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </CardContent>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Achievements Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Your Achievements
        </Typography>
        <Grid container spacing={3}>
          {achievements.map((achievement, index) => (
            <Grid key={achievement.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: 2,
                    opacity: achievement.unlocked ? 1 : 0.7,
                    filter: achievement.unlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: achievement.unlocked ? getAgeGroupColor() : theme.palette.grey[400],
                          mr: 2,
                        }}
                      >
                        {achievement.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {achievement.title}
                        </Typography>
                        {achievement.unlocked && achievement.date && (
                          <Typography variant="caption" color="text.secondary">
                            Unlocked on {new Date(achievement.date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recommended Activities */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Recommended For You
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 2,
                  border: `1px solid ${theme.palette.grey[200]}`,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 200, display: { xs: 'none', sm: 'block' } }}
                  image="https://via.placeholder.com/400x300?text=Blockchain+Basics"
                  alt="Blockchain Basics"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Bookmark sx={{ color: getAgeGroupColor(), mr: 1 }} />
                      <Typography variant="h6" component="h3">
                        Continue "Blockchain Basics"
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      You're making great progress! Continue learning about how blockchain works and why it's revolutionary.
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/learning/blockchain-basics"
                      variant="contained"
                      startIcon={<PlayArrow />}
                      sx={{
                        backgroundColor: getAgeGroupColor(),
                        '&:hover': {
                          backgroundColor: theme.palette[ageGroup].dark,
                        },
                      }}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
