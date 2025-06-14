import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useAgeGroup } from '../../context/AgeGroupContext';

const HomePage = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  
  // Get color based on age group
  const getAgeGroupColor = () => {
    return theme.palette[ageGroup].main;
  };
  
  // Features section data
  const features = [
    {
      title: 'Interactive Learning',
      description: 'Learn about blockchain through fun, interactive games and activities.',
      image: 'https://img.freepik.com/free-vector/children-learning-together-concept_23-2148630278.jpg',
    },
    {
      title: 'Age-Appropriate Content',
      description: 'Content tailored to your age group, making complex concepts easy to understand.',
      image: 'https://img.freepik.com/free-vector/kids-online-lessons-concept_23-2148520728.jpg',
    },
    {
      title: 'Track Your Progress',
      description: 'See your learning journey and earn achievements as you master new concepts.',
      image: 'https://img.freepik.com/free-vector/children-doing-different-activities_1308-30818.jpg',
    },
  ];
  
  // Learning modules preview based on age group
  const getModulesByAgeGroup = () => {
    switch(ageGroup) {
      case 'young':
        return [
          {
            id: 'blockchain-friends',
            title: 'Meet the Blockchain Friends',
            description: 'Learn about blockchain through fun stories with Ada and her magical notebook!',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-118859.jpg',
            course: 'COURSE 1',
            level: 'BEGINNER',
          },
          {
            id: 'digital-treasures',
            title: 'Digital Treasures',
            description: 'Collect digital stickers and learn how blockchain helps keep track of who owns what.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-133160.jpg',
            course: 'COURSE 2',
            level: 'BEGINNER',
          },
          {
            id: 'cardano-land',
            title: 'Welcome to Cardano Land',
            description: 'Explore the magical land of Cardano with the friendly Ouroboros dragon!',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-126336.jpg',
            course: 'COURSE 2',
            level: 'BEGINNER',
          },
        ];
      case 'middle':
        return [
          {
            id: 'blockchain-explorers',
            title: 'How Blockchains Work',
            description: 'Discover blocks, chains, and networks through fun hands-on activities.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-118859.jpg',
            course: 'COURSE 3',
            level: 'INTERMEDIATE',
          },
          {
            id: 'exploring-cardano',
            title: 'Exploring Cardano',
            description: 'Learn what makes Cardano special and how to use a blockchain explorer.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-126336.jpg',
            course: 'COURSE 3',
            level: 'INTERMEDIATE',
          },
          {
            id: 'digital-treasures',
            title: 'Understanding Digital Assets',
            description: 'Learn about different types of tokens and build your own digital collection!',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-133160.jpg',
            course: 'COURSE 4',
            level: 'INTERMEDIATE',
          },
        ];
      case 'older':
        return [
          {
            id: 'smart-contracts',
            title: 'Smart Contracts Explained',
            description: 'Learn how smart contracts work like digital agreements that run automatically.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-126336.jpg',
            course: 'COURSE 5',
            level: 'ADVANCED',
          },
          {
            id: 'building-cardano',
            title: 'Building on Cardano',
            description: 'Design your own decentralized application (DApp) to solve real problems.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-118859.jpg',
            course: 'COURSE 5',
            level: 'ADVANCED',
          },
          {
            id: 'blockchain-friends',
            title: 'Governance and the Future',
            description: 'Explore how Cardano makes decisions and how you can help build a better world with blockchain.',
            image: 'https://img.freepik.com/free-vector/children-playing-with-blocks-toys_1308-133160.jpg',
            course: 'COURSE 6',
            level: 'ADVANCED',
          },
        ];
      default:
        return [];
    }
  };
  
  const modules = getModulesByAgeGroup();
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          background: `linear-gradient(135deg, ${theme.palette[ageGroup].light} 0%, ${theme.palette[ageGroup].main} 100%)`,
          color: theme.palette[ageGroup].contrastText,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Welcome to Cardano Kids
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Your adventure into blockchain technology starts here! Learn about blockchain, 
                  digital ownership, and more through fun, interactive lessons designed just for you.
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    sx={{
                      mr: 2,
                      mb: 2,
                      bgcolor: 'white',
                      color: getAgeGroupColor(),
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Start Learning
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      mb: 2,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    display: { xs: 'none', md: 'block' },
                  }}
                  alt="Cardano Kids Logo"
                  src={require('../../assets/images/cardanokids-logo.png')}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Why Cardano Kids?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography>{feature.description}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Learning Modules Preview */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Start Your Learning Journey
          </Typography>
          <Grid container spacing={4}>
            {modules.map((module, index) => (
              <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: 2,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={module.image}
                      alt={module.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mb: 1
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            backgroundColor: getAgeGroupColor(),
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          {module.course}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          {module.level}
                        </Typography>
                      </Box>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {module.description}
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={`/learning/${module.id}`}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                      >
                        Start Module
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: getAgeGroupColor(),
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="inherit"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Ready to Start Your Blockchain Adventure?
          </Typography>
          <Typography variant="h6" align="center" color="inherit" paragraph>
            Join thousands of kids learning about blockchain technology in a fun and engaging way.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: 'white',
                color: getAgeGroupColor(),
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
