import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  LinearProgress,
  useTheme,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Refresh,
  Check,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Define module content with age-appropriate versions
const moduleContent = {
  'digital-treasures': {
    young: {
      title: 'Digital Treasures',
      description: 'Learn about digital ownership and how blockchain helps us keep track of who owns what.',
      character: 'Captain Block',
      characterImage: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
      steps: [
        {
          title: 'What are Digital Treasures?',
          content: 'Digital treasures are special things that exist on computers, like pictures, music, or even special tokens. Just like your toys at home belong to you, digital treasures can belong to people too!',
          activity: {
            type: 'quiz',
            title: 'Quick Check',
            description: 'Can you name something that could be a digital treasure?',
          },
        },
        {
          title: 'Who Owns Digital Treasures?',
          content: 'When you draw a picture on paper, it\'s yours. But how do we know who owns a digital picture? That\'s where blockchain helps! It\'s like a special notebook that writes down who owns what, and everyone can see it.',
          activity: {
            type: 'matching',
            title: 'Ownership Matching',
            description: 'Match the digital treasures to their owners!',
          },
        },
        {
          title: 'Keeping Digital Treasures Safe',
          content: 'Blockchain keeps your digital treasures safe by using special codes called "keys". It\'s like having a special key to your treasure chest that only you can use!',
          activity: {
            type: 'game',
            title: 'Key Keeper',
            description: 'Help Captain Block find the right keys to unlock the digital treasures!',
          },
        },
        {
          title: 'Sharing and Trading',
          content: 'You can share your digital treasures with friends or trade them, just like trading cards! Blockchain helps make sure everyone knows who owns what after trading.',
          activity: {
            type: 'simulation',
            title: 'Trading Time',
            description: 'Practice trading digital treasures with your friends!',
          },
        },
        {
          title: 'Digital Treasures in the Real World',
          content: 'Digital treasures are used in many places! They can be special items in games, art that people collect, or even tickets to events.',
          activity: {
            type: 'creative',
            title: 'Create Your Treasure',
            description: 'Draw your own digital treasure and think about what makes it special!',
          },
        },
      ],
    },
    middle: {
      title: 'Digital Treasures',
      description: 'Explore digital ownership and how blockchain technology secures and verifies who owns what in the digital world.',
      character: 'Professor Ledger',
      characterImage: 'https://img.freepik.com/free-vector/cute-boy-scientist-cartoon-vector-icon-illustration-people-science-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3851.jpg',
      steps: [
        {
          title: 'Understanding Digital Assets',
          content: 'Digital assets are items that exist in digital form and have value. These can include digital art, music, in-game items, or tokens that represent ownership of something. Unlike physical items, digital assets can be copied easily, which creates challenges for proving ownership.',
          activity: {
            type: 'quiz',
            title: 'Digital Asset Identification',
            description: 'Can you identify which of these are digital assets and explain why?',
          },
        },
        {
          title: 'The Ownership Challenge',
          content: 'Before blockchain, it was difficult to prove who truly owned a digital asset. Centralized databases could be changed or hacked, and there was no transparent way to track ownership history. Blockchain solves this by creating a tamper-proof record that everyone can verify.',
          activity: {
            type: 'case study',
            title: 'Ownership Detective',
            description: 'Investigate how ownership was tracked before blockchain and identify the problems.',
          },
        },
        {
          title: 'Blockchain and Digital Ownership',
          content: 'Blockchain creates a secure record of who owns what by using cryptography (secret codes) and a distributed ledger (a record kept by many computers). When you own a digital asset on a blockchain, you have a unique digital key that proves it\'s yours.',
          activity: {
            type: 'simulation',
            title: 'Blockchain Explorer',
            description: 'Use a simplified blockchain explorer to track the ownership history of a digital asset.',
          },
        },
        {
          title: 'Trading and Transferring Digital Assets',
          content: 'When you want to give or sell your digital asset to someone else, blockchain records this transfer securely. This creates a complete history of ownership that can\'t be changed, called "provenance."',
          activity: {
            type: 'role play',
            title: 'Digital Marketplace',
            description: 'Practice buying and selling digital assets and see how blockchain records these transactions.',
          },
        },
        {
          title: 'Real-World Applications',
          content: 'Digital ownership through blockchain is being used for art (NFTs), gaming items, music rights, event tickets, and even to represent ownership of physical items like houses or cars in the digital world.',
          activity: {
            type: 'research',
            title: 'Application Explorer',
            description: 'Research and present a real-world example of blockchain being used for digital ownership.',
          },
        },
      ],
    },
    older: {
      title: 'Digital Treasures',
      description: 'A comprehensive exploration of digital asset ownership, non-fungible tokens (NFTs), and how blockchain technology enables verifiable digital property rights.',
      character: 'Dr. Crypto',
      characterImage: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
      steps: [
        {
          title: 'The Evolution of Digital Ownership',
          content: 'Digital ownership has evolved from simple copyright claims to complex blockchain-based property rights. Traditional digital assets suffered from the "double-spending problem" - the ability to copy digital files infinitely without degradation. Blockchain technology introduced scarcity and verifiable ownership to the digital realm.',
          activity: {
            type: 'analysis',
            title: 'Digital Ownership Timeline',
            description: 'Create a timeline showing how digital ownership has evolved and identify key technological breakthroughs.',
          },
        },
        {
          title: 'Cryptographic Proof of Ownership',
          content: 'Blockchain uses public-key cryptography to establish ownership. Your private key (which only you have) creates a digital signature that can be verified using your public key (which everyone can see). This cryptographic system makes it mathematically provable that you authorized a transaction or claim ownership of a digital asset.',
          activity: {
            type: 'technical demo',
            title: 'Cryptographic Verification',
            description: 'Use a simplified cryptographic tool to sign a digital asset and verify ownership.',
          },
        },
        {
          title: 'Non-Fungible Tokens (NFTs)',
          content: 'NFTs are unique blockchain tokens that represent ownership of a specific digital or physical item. Unlike cryptocurrencies where each unit is identical (fungible), each NFT has unique properties and metadata. NFTs have revolutionized digital art, collectibles, and gaming by creating verifiable scarcity and provenance.',
          activity: {
            type: 'case study',
            title: 'NFT Analysis',
            description: 'Analyze a successful NFT project and identify the factors that contributed to its value and significance.',
          },
        },
        {
          title: 'Smart Contracts and Digital Rights Management',
          content: 'Smart contracts are self-executing programs on the blockchain that can automatically enforce ownership rights, royalty payments, and usage permissions. They enable creators to maintain control over their digital assets even after sale, such as receiving royalties on secondary sales.',
          activity: {
            type: 'coding',
            title: 'Simple Smart Contract',
            description: 'Create a basic smart contract that defines ownership rules for a digital asset.',
          },
        },
        {
          title: 'The Future of Digital Ownership',
          content: 'Digital ownership is expanding beyond art and collectibles into virtual real estate, identity verification, intellectual property rights, and the metaverse. Emerging technologies like zero-knowledge proofs are enhancing privacy while maintaining verifiability. Interoperability between different blockchain systems is becoming crucial for a seamless digital ownership ecosystem.',
          activity: {
            type: 'research project',
            title: 'Future Trends',
            description: 'Research and present on an emerging application of blockchain-based digital ownership.',
          },
        },
      ],
    },
  },
  // Add more modules as needed
};

const LearningModulePage = () => {
  const theme = useTheme();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { ageGroup } = useAgeGroup();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Get module content based on moduleId and ageGroup
  const module = moduleId && Object.keys(moduleContent).includes(moduleId)
    ? (moduleContent as any)[moduleId][ageGroup]
    : null;
  
  // Update progress when step changes
  useEffect(() => {
    if (module) {
      const newProgress = Math.round(((activeStep + 1) / module.steps.length) * 100);
      setProgress(newProgress);
    }
  }, [activeStep, module]);
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };
  
  // Handle reset
  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
  };
  
  // Handle complete
  const handleComplete = () => {
    setCompleted(true);
  };
  
  // If module not found
  if (!module) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Module Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            Sorry, we couldn't find the learning module you're looking for.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Module Header */}
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
                {module.title}
              </Typography>
              <Typography variant="h6">
                {module.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Progress: {progress}%
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Avatar
                src={module.characterImage}
                alt={module.character}
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  border: '4px solid white',
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Your Guide: {module.character}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
      
      <Grid container spacing={4}>
        {/* Learning Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              {completed ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette[ageGroup].main,
                      width: 80,
                      height: 80,
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    <EmojiEvents fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" gutterBottom>
                    Congratulations!
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    You've completed the {module.title} module!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You've learned all about digital ownership and how blockchain technology helps track and secure digital assets.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReset}
                      sx={{ mr: 2 }}
                    >
                      Review Module Again
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {module.steps[activeStep].title}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="body1" paragraph>
                    {module.steps[activeStep].content}
                  </Typography>
                  
                  {/* Activity Section */}
                  <Card
                    sx={{
                      mt: 4,
                      mb: 4,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette[ageGroup].light}`,
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: theme.palette[ageGroup].main }}>
                        Activity: {module.steps[activeStep].activity.title}
                      </Typography>
                      <Typography variant="body1">
                        {module.steps[activeStep].activity.description}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<ArrowBack />}
                    >
                      Back
                    </Button>
                    <Box>
                      {activeStep === module.steps.length - 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleComplete}
                          endIcon={<Check />}
                        >
                          Complete
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          endIcon={<ArrowForward />}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Learning Path Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Learning Path
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                {module.steps.map((step: any, index: number) => (
                  <Step key={step.title} completed={index < activeStep || completed}>
                    <StepLabel
                      optional={
                        index === module.steps.length - 1 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      {step.title}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.activity.title} - {step.activity.type}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LearningModulePage;
