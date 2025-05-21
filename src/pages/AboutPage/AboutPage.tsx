import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider,
  useTheme 
} from '@mui/material';
import { 
  School, 
  ChildCare, 
  Security, 
  Psychology, 
  Accessibility, 
  EmojiObjects 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAgeGroup } from '../../context/AgeGroupContext';

const AboutPage = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  
  // Core values data
  const coreValues = [
    {
      title: 'Education First',
      description: 'We focus on educational content that teaches real blockchain concepts in an age-appropriate way.',
      icon: <School fontSize="large" />,
    },
    {
      title: 'Child-Friendly',
      description: 'All content is designed specifically for children aged 6-14, with age-appropriate language and examples.',
      icon: <ChildCare fontSize="large" />,
    },
    {
      title: 'Safe Learning',
      description: 'We create a safe environment for children to learn about blockchain without exposure to cryptocurrency investment.',
      icon: <Security fontSize="large" />,
    },
    {
      title: 'Interactive Learning',
      description: 'We believe in learning by doing, with interactive exercises that reinforce concepts.',
      icon: <Psychology fontSize="large" />,
    },
    {
      title: 'Accessibility',
      description: 'Our platform is designed to be accessible to all children, regardless of background or prior knowledge.',
      icon: <Accessibility fontSize="large" />,
    },
    {
      title: 'Innovation',
      description: 'We stay at the forefront of educational technology to provide the best learning experience.',
      icon: <EmojiObjects fontSize="large" />,
    },
  ];
  
  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Education Director',
      bio: 'Former elementary school teacher with a PhD in Educational Technology. Passionate about making complex topics accessible to young minds.',
      avatar: 'https://via.placeholder.com/150?text=SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Blockchain Expert',
      bio: 'Blockchain developer with 8 years of experience. Dedicated to explaining blockchain technology in simple, understandable terms.',
      avatar: 'https://via.placeholder.com/150?text=MC',
    },
    {
      name: 'Emma Rodriguez',
      role: 'UX Designer',
      bio: 'Specialist in designing digital experiences for children. Creates engaging, intuitive interfaces that make learning fun.',
      avatar: 'https://via.placeholder.com/150?text=ER',
    },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* About Section */}
      <Box sx={{ mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            About Cardano Kids
          </Typography>
          
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Empowering the next generation with blockchain literacy through fun, interactive learning.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette[ageGroup].main }}>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                Cardano Kids is dedicated to introducing children aged 6-14 to the world of blockchain technology 
                through engaging, age-appropriate content. We believe that understanding blockchain is becoming 
                as important as digital literacy, and we're committed to making this knowledge accessible to 
                young learners.
              </Typography>
              <Typography variant="body1" paragraph>
                Our platform focuses solely on the educational aspects of blockchain technology, avoiding 
                cryptocurrency investment discussions. Instead, we teach fundamental concepts like decentralization, 
                consensus mechanisms, smart contracts, and digital ownership through stories, games, and 
                interactive experiences.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette[ageGroup].main }}>
                Why Blockchain Education?
              </Typography>
              <Typography variant="body1" paragraph>
                Blockchain technology is revolutionizing how we think about digital ownership, trust, and 
                value exchange. By introducing these concepts early, we're preparing children for a future 
                where blockchain applications will be commonplace in many aspects of life.
              </Typography>
              <Typography variant="body1" paragraph>
                Our age-toggle functionality ensures that content is presented at the right level of complexity 
                for each child, growing with them as they develop their understanding. From simple analogies 
                for younger children to more technical explanations for older ones, we make blockchain 
                concepts accessible to all age groups.
              </Typography>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
      
      <Divider sx={{ mb: 8 }} />
      
      {/* Core Values Section */}
      <Box sx={{ mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Our Core Values
          </Typography>
          
          <Grid container spacing={4}>
            {coreValues.map((value, index) => (
              <Grid key={value.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      boxShadow: 2,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette[ageGroup].main,
                            width: 60,
                            height: 60,
                          }}
                        >
                          {value.icon}
                        </Avatar>
                      </Box>
                      <Typography gutterBottom variant="h5" component="h3" align="center" sx={{ fontWeight: 'bold' }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
      
      <Divider sx={{ mb: 8 }} />
      
      {/* Team Section */}
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Meet Our Team
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid key={member.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRadius: 4,
                      boxShadow: 2,
                      p: 3,
                    }}
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        border: `4px solid ${theme.palette[ageGroup].main}`,
                      }}
                    />
                    <Typography gutterBottom variant="h5" component="h3" align="center" sx={{ fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {member.bio}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AboutPage;
