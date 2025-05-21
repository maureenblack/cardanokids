import React from 'react';
import { Container, Typography, Box, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAgeGroup } from '../../context/AgeGroupContext';

const NotFoundPage = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 'bold',
              color: theme.palette[ageGroup].main,
            }}
          >
            404
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Oops! Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            It looks like you've ventured into uncharted territory! The page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2, mb: 2 }}
          >
            Go Home
          </Button>
          
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ mb: 2 }}
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
