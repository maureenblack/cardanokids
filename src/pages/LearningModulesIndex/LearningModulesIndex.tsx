import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Box,
  Chip,
  useTheme,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Module interface
interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  steps: number;
  completed?: boolean;
}

const LearningModulesIndex: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { ageGroup } = useAgeGroup();
  
  // Get completed modules from local storage
  const getCompletedModules = (): string[] => {
    const certificates = JSON.parse(localStorage.getItem('cardanoKidsCertificates') || '[]');
    return certificates.map((cert: any) => cert.moduleId);
  };
  
  const completedModules = getCompletedModules();
  
  // Available modules
  const modules: Module[] = [
    // BEGINNER LEVEL (Ages 6-8)
    {
      id: 'blockchain-friends',
      title: 'COURSE 1: MEET THE BLOCKCHAIN FRIENDS',
      description: 'Learn about blockchain through fun stories and activities with Ada and her friends.',
      image: 'https://img.freepik.com/free-vector/hand-drawn-nft-concept_23-2149199088.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('blockchain-friends')
    },
    {
      id: 'building-blocks',
      title: 'Module 1: What is a Blockchain?',
      description: 'Learn the basics of blockchain technology through fun, interactive activities.',
      image: 'https://img.freepik.com/free-vector/gradient-blockchain-concept_23-2149166908.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('building-blocks')
    },
    {
      id: 'blockchain-blocks',
      title: 'Module 2: Blockchains Are Like Building Blocks',
      description: 'Learn how blockchains work by building your own chain of blocks!',
      image: 'https://img.freepik.com/free-vector/gradient-blockchain-concept_23-2149166908.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('blockchain-blocks')
    },
    {
      id: 'blockchain-heroes',
      title: 'Module 3: Blockchain Heroes',
      description: 'Join Ada and her friends on an adventure to learn how blockchain heroes keep the network safe!',
      image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('blockchain-heroes')
    },
    {
      id: 'cardano-world',
      title: 'COURSE 2: CARDANO WORLD ADVENTURES',
      description: 'Explore the exciting world of Cardano and learn about its unique features.',
      image: 'https://img.freepik.com/free-vector/gradient-crypto-concept_23-2149166905.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('cardano-world')
    },
    {
      id: 'cardano-land',
      title: 'Module 1: Welcome to Cardano Land',
      description: 'Discover the magical world of Cardano and meet its friendly inhabitants.',
      image: 'https://img.freepik.com/free-vector/gradient-metaverse-concept_23-2149166922.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('cardano-land')
    },
    {
      id: 'digital-treasures',
      title: 'Module 2: Digital Treasures',
      description: 'Learn about digital ownership and how blockchain helps us keep track of who owns what.',
      image: 'https://img.freepik.com/free-vector/gradient-nft-concept_23-2149166903.jpg',
      level: 'beginner',
      steps: 8,
      completed: completedModules.includes('digital-treasures')
    }
  ];
  
  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    navigate(`/learning/${moduleId}`);
  };
  
  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get level label
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return level;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Learning Modules
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore interactive modules to learn about blockchain technology
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 6, 
            borderRadius: 3, 
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body1" paragraph>
            Welcome to the Cardano Kids learning platform! Here you'll find interactive modules designed to teach you all about blockchain technology in a fun and engaging way. Each module includes:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Interactive Activities
                </Typography>
                <Typography variant="body2">
                  Hands-on experiences to help you understand blockchain concepts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Knowledge Quizzes
                </Typography>
                <Typography variant="body2">
                  Test what you've learned and earn NFT certificates
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Age-Appropriate Content
                </Typography>
                <Typography variant="body2">
                  Content tailored to your age group for the best learning experience
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={4}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: 3,
                    position: 'relative'
                  }}
                >
                  {module.completed && (
                    <Chip
                      label="Completed"
                      color="success"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1
                      }}
                    />
                  )}
                  <CardActionArea onClick={() => handleModuleSelect(module.id)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={module.image}
                      alt={module.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {module.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={getLevelLabel(module.level)} 
                          size="small"
                          sx={{ 
                            backgroundColor: getLevelColor(module.level),
                            color: 'white'
                          }}
                        />
                        <Typography variant="caption">
                          {module.steps} Steps
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default LearningModulesIndex;
