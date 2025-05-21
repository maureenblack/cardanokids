import React from 'react';
import { Box, Container, Typography, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAgeGroup } from '../../context/AgeGroupContext';

const Footer = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  
  // Get color based on age group
  const getAgeGroupColor = () => {
    return theme.palette[ageGroup].main;
  };
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Cardano Kids
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Making blockchain education fun and accessible for children aged 6-14.
              Learn about blockchain technology through interactive and age-appropriate content.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} to="/" color="inherit" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link component={RouterLink} to="/dashboard" color="inherit" sx={{ mb: 1 }}>
                Dashboard
              </Link>
              <Link component={RouterLink} to="/learning" color="inherit" sx={{ mb: 1 }}>
                Learning Modules
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" sx={{ mb: 1 }}>
                About
              </Link>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              For Parents
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} to="/parent-dashboard" color="inherit" sx={{ mb: 1 }}>
                Parent Dashboard
              </Link>
              <Link component={RouterLink} to="/resources" color="inherit" sx={{ mb: 1 }}>
                Educational Resources
              </Link>
              <Link component={RouterLink} to="/faq" color="inherit" sx={{ mb: 1 }}>
                FAQ
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" sx={{ mb: 1 }}>
                Contact Us
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            <Link color="inherit" href="https://cardanokids.org">
              Cardano Kids
            </Link>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
