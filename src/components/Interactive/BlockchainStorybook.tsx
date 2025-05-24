import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Avatar, 
  Card, 
  CardContent,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useAgeGroup } from '../../context/AgeGroupContext';

interface Character {
  name: string;
  image: string;
  description: string;
  role: string;
}

interface StoryPage {
  title: string;
  content: string;
  image?: string;
  character: Character;
  animation?: string;
}

interface BlockchainStorybookProps {
  title: string;
  description: string;
  pages: StoryPage[];
  onComplete?: () => void;
}

const BlockchainStorybook: React.FC<BlockchainStorybookProps> = ({ 
  title, 
  description, 
  pages, 
  onComplete 
}) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [currentPage, setCurrentPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [characterVisible, setCharacterVisible] = useState(false);

  useEffect(() => {
    // Show character with a slight delay for better animation effect
    const timer = setTimeout(() => {
      setCharacterVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCharacterVisible(false);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 300);
    } else {
      setCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCharacterVisible(false);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCompleted(false);
    setCurrentPage(0);
  };

  // Get current page data
  const currentPageData = pages[currentPage];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette[ageGroup].light}20 0%, ${theme.palette[ageGroup].light}50 100%)`,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>

        {/* Progress indicator */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3 
          }}
        >
          {pages.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                mx: 0.5,
                bgcolor: index === currentPage 
                  ? theme.palette[ageGroup].main 
                  : index < currentPage 
                    ? theme.palette[ageGroup].light 
                    : 'rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>

        {!completed ? (
          <Grid container spacing={4}>
            {/* Character side */}
            <Grid item xs={12} md={4}>
              <AnimatePresence mode="wait">
                {characterVisible && (
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card 
                      elevation={2} 
                      sx={{ 
                        borderRadius: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      <Box 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <Avatar 
                          src={currentPageData.character.image} 
                          alt={currentPageData.character.name}
                          sx={{ 
                            width: 120, 
                            height: 120, 
                            mb: 2,
                            border: `3px solid ${theme.palette[ageGroup].main}`
                          }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {currentPageData.character.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {currentPageData.character.role}
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                          "{currentPageData.character.description}"
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>

            {/* Story content side */}
            <Grid item xs={12} md={8}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {currentPageData.image && (
                      <Box 
                        sx={{ 
                          height: 200, 
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <Box
                          component="img"
                          src={currentPageData.image}
                          alt={currentPageData.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        {currentPageData.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {currentPageData.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Typography variant="h5" gutterBottom>
                Story Complete!
              </Typography>
              <Typography variant="body1" paragraph>
                You've finished the story. Great job learning about blockchain!
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleRestart}
                sx={{ mr: 2 }}
              >
                Read Again
              </Button>
            </motion.div>
          </Box>
        )}

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePrevious}
            disabled={currentPage === 0 || completed}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<NavigateNextIcon />}
            onClick={handleNext}
            disabled={completed}
          >
            {currentPage === pages.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlockchainStorybook;
