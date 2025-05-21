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
import BlockchainBuilder from '../../components/Interactive/BlockchainBuilder';

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
          title: 'Collecting Digital Stickers',
          content: 'Digital treasures are special things that exist on computers, like pictures, music, or even special tokens. Just like your toys at home belong to you, digital treasures can belong to people too! Ada has a special digital sticker book that everyone can see, but only she can add stickers to it.',
          activity: {
            type: 'craft',
            title: 'Design Your Own Digital Sticker',
            description: 'Draw a special sticker that you would like to have in your digital collection!',
          },
        },
        {
          title: 'Your Own Digital Treasure Box',
          content: 'On a blockchain like Cardano, we can keep track of who owns what digital treasure. It\'s like having a special chest that only you can open with your special key. Everyone can see the chest, but only you can open it!',
          activity: {
            type: 'craft',
            title: 'Make a Paper Wallet',
            description: 'Create and decorate a "wallet" box for your paper tokens and a paper key with unique patterns.',
          },
        },
        {
          title: 'Finding Digital Treasures',
          content: 'You can collect digital treasures just like you collect toys or stickers! Each one is special and can\'t be copied. The blockchain remembers that it belongs to you. Ada loves to go on treasure hunts using special clues to find new digital treasures.',
          activity: {
            type: 'game',
            title: 'Treasure Hunt',
            description: 'Play hide and seek with "transaction" cards hidden around the room!',
          },
        },
        {
          title: 'Trading Digital Stickers',
          content: 'Just like trading real stickers with friends, you can trade digital stickers too! The blockchain helps make sure trades are fair and everyone gets what they agreed to.',
          activity: {
            type: 'game',
            title: 'Sticker Trading Game',
            description: 'Trade physical stickers with your friends using simple blockchain rules.',
          },
        },
        {
          title: 'Congratulations!',
          content: 'Great job learning about Digital Treasures! Now you know how blockchain helps us keep track of special digital things.',
          activity: {
            type: 'certificate',
            title: 'Digital Treasures Expert',
            description: 'You\'ve earned your Digital Treasures badge!',
          },
        },
      ],
    },
    middle: {
      title: 'Understanding Digital Assets',
      description: 'Explore digital ownership and how blockchain technology secures and verifies who owns what in the digital world.',
      character: 'Professor Ledger',
      characterImage: 'https://img.freepik.com/free-vector/cute-boy-scientist-cartoon-vector-icon-illustration-people-science-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3851.jpg',
      steps: [
        {
          title: 'What Are Tokens?',
          content: 'Digital assets are items that exist in digital form and come with the right to use. On Cardano, we have different types of tokens for different purposes. Some tokens are fungible (each one is the same as another), while others are non-fungible (each one is unique).',
          activity: {
            type: 'interactive',
            title: 'Token Categories',
            description: 'Design different categories of tokens for different purposes and categorize various tokens by their uses.',
          },
        },
        {
          title: 'NFTs: One-of-a-Kind Digital Items',
          content: 'Non-fungible tokens (NFTs) are special digital assets that represent ownership of a unique item. Unlike cryptocurrencies where each unit is identical, each NFT is distinct and can represent artwork, collectibles, or other unique digital items.',
          activity: {
            type: 'project',
            title: 'Create Your NFT',
            description: 'Create a unique digital artwork and "mint" it as a paper NFT, then verify the uniqueness of each other\'s NFTs using a registry.',
          },
        },
        {
          title: 'Building a Collection',
          content: 'Digital collections work similarly to physical collections, but with some important differences. Digital items don\'t degrade over time, can be authenticated easily, and can sometimes have special digital features that physical items can\'t have.',
          activity: {
            type: 'project',
            title: 'Start a Collection',
            description: 'Start a themed digital collection project and participate in a digital collection trading simulation.',
          },
        },
        {
          title: 'Digital Ownership in the Real World',
          content: 'Digital ownership extends beyond collectibles. It can represent tickets to events, proof of membership, or even ownership of virtual land in games. These digital rights are becoming increasingly important in our connected world.',
          activity: {
            type: 'research',
            title: 'Real-World Applications',
            description: 'Explore three real-world examples of how digital ownership is being used today.',
          },
        },
        {
          title: 'Module Complete!',
          content: 'Congratulations on completing the Understanding Digital Assets module! You now understand how blockchain technology enables secure digital ownership and the various forms digital assets can take.',
          activity: {
            type: 'achievement',
            title: 'Digital Asset Specialist',
            description: 'You\'ve earned the Digital Asset badge for your knowledge of blockchain-based digital assets!',
          },
        },
      ],
    },
    older: {
      title: 'Smart Contracts Explained',
      description: 'A comprehensive exploration of smart contracts, their applications, and how they enable automated agreements on the Cardano blockchain.',
      character: 'Dr. Crypto',
      characterImage: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
      steps: [
        {
          title: 'What Are Smart Contracts?',
          content: 'Smart contracts are self-executing agreements with the terms directly written into code. They automatically enforce and execute the terms of an agreement when predefined conditions are met, without requiring intermediaries.',
          activity: {
            type: 'analysis',
            title: 'Contract Analysis',
            description: 'Design a simple smart contract for a classroom task and identify real-world agreements that could use smart contracts.',
          },
        },
        {
          title: 'Creating Rules That Work Automatically',
          content: 'Smart contracts use if-then logic to create rules that execute automatically. For example, "If person A sends 10 tokens, then transfer digital item B to person A." This automation removes the need for trusted third parties to enforce agreements.',
          activity: {
            type: 'programming',
            title: 'Logic Building',
            description: 'Use block-based programming to create simple contract logic and debug a broken smart contract scenario.',
          },
        },
        {
          title: 'Plutus: Cardano\'s Smart Contract Language',
          content: 'Plutus is Cardano\'s smart contract platform, based on the Haskell programming language. It was designed with security and verification in mind, making it possible to mathematically prove that contracts will behave as expected.',
          activity: {
            type: 'technical',
            title: 'Pseudo-Plutus',
            description: 'Translate simple English rules into pseudo-Plutus and design a simple application using block-based smart contract logic.',
          },
        },
        {
          title: 'Real-World Smart Contract Applications',
          content: 'Smart contracts enable a wide range of applications, from simple escrow services to complex decentralized finance protocols. They can automate business processes, create new markets, and enable trustless interactions between parties who don\'t know each other.',
          activity: {
            type: 'case-study',
            title: 'Application Analysis',
            description: 'Research three real-world smart contract applications and analyze their benefits and limitations.',
          },
        },
        {
          title: 'Smart Contract Security and Best Practices',
          content: 'Security is paramount in smart contract development, as vulnerabilities can lead to loss of funds or other assets. Best practices include formal verification, comprehensive testing, and code audits by security experts.',
          activity: {
            type: 'security-audit',
            title: 'Vulnerability Detection',
            description: 'Identify potential security issues in a sample smart contract and propose solutions.',
          },
        },
        {
          title: 'Module Mastery Achieved',
          content: 'You have completed an advanced exploration of smart contracts on blockchain. This knowledge provides a foundation for understanding both current applications and future innovations in this rapidly evolving field.',
          activity: {
            type: 'certification',
            title: 'Smart Contract Architect',
            description: 'You have earned certification as a Smart Contract Architect, recognizing your comprehensive understanding of blockchain-based automated agreements.',
          },
        },
      ],
    },
  },
  'blockchain-friends': {
    young: {
      title: 'Meet the Blockchain Friends',
      description: 'Learn about blockchain through fun stories and activities with Ada and her friends.',
      character: 'Ada',
      characterImage: 'https://img.freepik.com/free-vector/cute-girl-with-idea-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
      steps: [
        {
          title: 'Meet Ada and Her Special Book',
          content: 'Ada has a magical notebook that everyone can see but nobody can erase. When she writes something in it, all her friends can see it, and no one can change it!',
          activity: {
            type: 'craft',
            title: 'Paper Chain Activity',
            description: 'Create a simple paper chain, each link containing a drawing or note.',
          },
        },
        {
          title: 'Digital Money Magic',
          content: 'Ada has special tokens that help her friends trade fairly. Each token is special and can\'t be copied, so everyone knows they\'re real!',
          activity: {
            type: 'craft',
            title: 'Design Your Tokens',
            description: 'Create paper coins with unique designs that can\'t be copied.',
          },
        },
        {
          title: 'The Friendship Network',
          content: 'Ada\'s friends form a circle to check each other\'s work. This way, everyone agrees on what\'s written in the special book.',
          activity: {
            type: 'game',
            title: 'Circle Verification',
            description: 'Play a circle game where children verify each other\'s simple math problems.',
          },
        },
        {
          title: 'Congratulations!',
          content: 'Great job learning about blockchain with Ada and her friends! Now you know how a blockchain works like a special book that everyone can see but nobody can change.',
          activity: {
            type: 'certificate',
            title: 'Blockchain Friend',
            description: 'You\'ve earned your Blockchain Friend badge!',
          },
        },
      ],
    },
    middle: {
      title: 'How Blockchains Work',
      description: 'Explore the technical aspects of blockchain technology through interactive activities.',
      character: 'Professor Chain',
      characterImage: 'https://img.freepik.com/free-vector/cute-professor-holding-book-cartoon-vector-icon-illustration-people-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3851.jpg',
      steps: [
        {
          title: 'Blocks, Chains, and Networks',
          content: 'A blockchain is like a chain of digital blocks, each containing multiple transactions. Each block connects to the previous one, creating an unbreakable chain of information.',
          activity: {
            type: 'interactive',
            title: 'Build a Chain',
            description: 'Build a physical chain of blocks with transaction cards inside and identify which blocks connect to which in a visual puzzle.',
          },
        },
        {
          title: 'Digital Signatures and Keys',
          content: 'Digital signatures prove who you are on a blockchain, similar to how your handwritten signature proves your identity on paper. They use special mathematical formulas to create unique signatures that only you can make.',
          activity: {
            type: 'craft',
            title: 'Create a Signature',
            description: 'Create a personal "signature" with a simple encoding algorithm and verify each other\'s signatures using a decoder key.',
          },
        },
        {
          title: 'Consensus: How We All Agree',
          content: 'Blockchain networks need a way for all computers to agree on which transactions are valid. This agreement process is called consensus, and it\'s what makes blockchains trustworthy.',
          activity: {
            type: 'game',
            title: 'Consensus Circle',
            description: 'Play a musical chairs variant where children must agree on rules for approving "transactions".',
          },
        },
        {
          title: 'Module Complete!',
          content: 'Congratulations on completing the How Blockchains Work module! You now understand the fundamental concepts that make blockchain technology possible.',
          activity: {
            type: 'achievement',
            title: 'Blockchain Expert',
            description: 'You\'ve earned the Blockchain Expert badge for your knowledge of blockchain technology!',
          },
        },
      ],
    },
    older: {
      title: 'Governance and the Future',
      description: 'Explore how blockchain communities make decisions and shape the future of the technology.',
      character: 'Director Voltaire',
      characterImage: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
      steps: [
        {
          title: 'How Does Cardano Make Decisions?',
          content: 'Unlike traditional systems where a single authority makes decisions, Cardano uses decentralized governance. This means that the community of users collectively decides on changes and improvements to the system.',
          activity: {
            type: 'simulation',
            title: 'Governance Simulation',
            description: 'Participate in a classroom governance simulation with voting on proposed changes.',
          },
        },
        {
          title: 'Proposing Changes',
          content: 'Anyone can propose improvements to Cardano through Cardano Improvement Proposals (CIPs). These proposals are discussed, refined, and eventually voted on by the community.',
          activity: {
            type: 'project',
            title: 'Draft a CIP',
            description: 'Draft a simple Cardano Improvement Proposal (CIP) and present and defend it to classmates.',
          },
        },
        {
          title: 'The Treasury System',
          content: 'Cardano has a treasury system that funds development and community projects. A portion of all transaction fees goes into this treasury, and the community votes on which projects should receive funding.',
          activity: {
            type: 'simulation',
            title: 'Treasury Allocation',
            description: 'Participate in a treasury allocation simulation with project pitches and voting.',
          },
        },
        {
          title: 'Building a Better World with Blockchain',
          content: 'Blockchain technology has the potential to address many global challenges, from financial inclusion to supply chain transparency. With this power comes the responsibility to use it ethically.',
          activity: {
            type: 'project',
            title: 'Blockchain Solution',
            description: 'Design a blockchain solution for a community problem as your final project.',
          },
        },
        {
          title: 'Module Mastery Achieved',
          content: 'You have completed an advanced exploration of blockchain governance. This knowledge empowers you to participate in shaping the future of blockchain technology.',
          activity: {
            type: 'certification',
            title: 'Governance Specialist',
            description: 'You have earned certification as a Governance Specialist, recognizing your understanding of decentralized decision-making systems.',
          },
        },
      ],
    },
  },
  'building-blocks': {
    young: {
      title: 'Blockchains Are Like Building Blocks',
      description: 'Learn how blockchains work by building your own chain of blocks!',
      character: 'Blocky',
      characterImage: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
      steps: [
        {
          title: 'What is a Blockchain?',
          content: 'A blockchain is like a special chain of building blocks. Each block contains information and is connected to the block before it. Blocky loves to build chains of blocks to keep track of important information!',
          activity: {
            type: 'interactive',
            title: 'Learn About Blockchain Blocks',
            description: 'Watch this short video to learn how blockchains work.',
            component: 'video',
            props: {
              videoUrl: 'https://www.youtube.com/embed/SSo_EIwHSd4',
              title: 'What is a Blockchain?'
            }
          },
        },
        {
          title: 'Build Your Own Blockchain',
          content: 'Now it\'s your turn to build a blockchain! Add blocks to the chain and see how each block connects to the one before it. Each block gets a special code (called a "hash") that depends on what\'s inside the block AND the code from the previous block.',
          activity: {
            type: 'interactive',
            title: 'Blockchain Builder',
            description: 'Create your own blockchain by adding blocks!',
            component: 'BlockchainBuilder',
            props: {}
          },
        },
        {
          title: 'Why Blockchains Are Special',
          content: 'Blockchains are special because they\'re very hard to change once they\'re created. If someone tries to change a block, all the blocks that come after it would need to change too! This makes blockchains very secure and trustworthy.',
          activity: {
            type: 'quiz',
            title: 'Blockchain Quiz',
            description: 'Test what you\'ve learned about blockchains!',
            questions: [
              {
                question: 'What connects one block to another in a blockchain?',
                options: ['A special code called a hash', 'A piece of string', 'Nothing, they just sit next to each other', 'Glue'],
                correctAnswer: 0
              },
              {
                question: 'Why are blockchains hard to change?',
                options: ['They\'re made of very hard material', 'Changing one block means you have to change all the blocks after it', 'They\'re locked with a key', 'They\'re too heavy to move'],
                correctAnswer: 1
              }
            ]
          },
        },
      ],
    },
    middle: {
      title: 'How Blockchains Work',
      description: 'Explore the technical aspects of blockchain technology and how blocks are linked together.',
      character: 'Professor Block',
      characterImage: 'https://img.freepik.com/free-vector/scientist-man-concept-illustration_114360-8147.jpg',
      steps: [
        {
          title: 'Blockchain Architecture',
          content: 'A blockchain is a distributed ledger that maintains a continuously growing list of records called blocks. Each block contains a timestamp and a link to the previous block, forming a chain. The data in a block cannot be altered retroactively without altering all subsequent blocks.',
          activity: {
            type: 'interactive',
            title: 'Blockchain Explorer',
            description: 'Examine the structure of a blockchain and see how blocks are connected.',
            component: 'BlockchainBuilder',
            props: { advanced: true }
          },
        },
        {
          title: 'Cryptographic Hashing',
          content: 'Blockchains use cryptographic hash functions to secure the data in each block. A hash function takes an input of any size and produces a fixed-size output. Even a small change in the input produces a completely different output, making it easy to detect if data has been tampered with.',
          activity: {
            type: 'interactive',
            title: 'Hash Generator',
            description: 'Try generating hashes from different inputs to see how they work.',
            component: 'HashGenerator',
            props: {}
          },
        },
        {
          title: 'Consensus Mechanisms',
          content: 'For a blockchain to function, all participants need to agree on which blocks are valid and which order they should be added to the chain. This agreement is achieved through consensus mechanisms like Proof of Stake, which is used by Cardano.',
          activity: {
            type: 'quiz',
            title: 'Consensus Quiz',
            description: 'Test your knowledge of blockchain consensus mechanisms.',
            questions: [
              {
                question: 'What consensus mechanism does Cardano use?',
                options: ['Proof of Work', 'Proof of Stake', 'Proof of Authority', 'Proof of Space'],
                correctAnswer: 1
              },
              {
                question: 'Why is consensus important in a blockchain?',
                options: ['It makes the blockchain faster', 'It ensures everyone agrees on the valid state of the blockchain', 'It reduces the size of the blockchain', 'It makes mining easier'],
                correctAnswer: 1
              }
            ]
          },
        },
      ],
    },
    older: {
      title: 'Building on Cardano',
      description: 'Learn how to build applications on the Cardano blockchain using smart contracts and native tokens.',
      character: 'Developer Dana',
      characterImage: 'https://img.freepik.com/free-vector/programmer-concept-illustration_114360-2417.jpg',
      steps: [
        {
          title: 'Introduction to Smart Contracts',
          content: 'Smart contracts are self-executing contracts with the terms directly written into code. On Cardano, smart contracts are written in Plutus, a functional programming language based on Haskell.',
          activity: {
            type: 'interactive',
            title: 'Smart Contract Simulator',
            description: 'Explore how smart contracts work on the Cardano blockchain.',
            component: 'SmartContractSimulator',
            props: {}
          },
        },
        {
          title: 'Native Tokens on Cardano',
          content: 'Cardano supports native tokens, which means you can create your own tokens without needing smart contracts. This makes them more efficient and secure compared to tokens on other blockchains.',
          activity: {
            type: 'interactive',
            title: 'Token Creator',
            description: 'Design your own token on the Cardano blockchain.',
            component: 'TokenCreator',
            props: {}
          },
        },
        {
          title: 'Building a Decentralized Application',
          content: 'Decentralized applications (DApps) are applications that run on a blockchain network rather than a single computer. They can be used for a wide range of purposes, from finance to gaming to social media.',
          activity: {
            type: 'project',
            title: 'DApp Design Challenge',
            description: 'Design a decentralized application that could be built on Cardano.',
            instructions: [
              'Think of a problem that could be solved with a decentralized application.',
              'Sketch out the basic functionality of your DApp.',
              'Consider what smart contracts and tokens would be needed.',
              'Present your design to the class or group.'
            ]
          },
        },
      ],
    },
  },
  // Additional modules would be added here
};

const LearningModulePage = () => {
  const theme = useTheme();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { ageGroup } = useAgeGroup();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Function to render different types of activities
  const renderActivity = () => {
    if (!module || !module.steps[activeStep]) return null;
    
    const activity = module.steps[activeStep].activity;
    
    switch (activity.type) {
      case 'interactive':
        // Handle different interactive components
        switch (activity.component) {
          case 'BlockchainBuilder':
            return <BlockchainBuilder {...activity.props} />;
          case 'video':
            return (
              <Box sx={{ mt: 3, position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                <iframe
                  src={activity.props.videoUrl}
                  title={activity.props.title || 'Educational Video'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            );
          // Add other interactive component types as needed
          default:
            return (
              <Typography variant="body1" color="error">
                Interactive component "{activity.component}" not implemented yet.
              </Typography>
            );
        }
      
      case 'quiz':
        return (
          <Box sx={{ mt: 3 }}>
            {activity.questions && activity.questions.map((question: any, index: number) => (
              <Card key={index} sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. {question.question}
                  </Typography>
                  {question.options.map((option: string, optIndex: number) => (
                    <Button
                      key={optIndex}
                      variant={optIndex === question.correctAnswer ? 'contained' : 'outlined'}
                      color={optIndex === question.correctAnswer ? 'success' : 'primary'}
                      sx={{ mr: 1, mb: 1 }}
                    >
                      {option}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      
      case 'craft':
      case 'project':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" paragraph>
              {activity.description}
            </Typography>
            {activity.instructions && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Instructions:
                </Typography>
                <ol>
                  {activity.instructions.map((instruction: string, index: number) => (
                    <li key={index}>
                      <Typography variant="body2">{instruction}</Typography>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Box>
        );
      
      default:
        return (
          <Typography variant="body1">
            {activity.description}
          </Typography>
        );
    }
  };
  
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
                      <Typography variant="body1" paragraph>
                        {module.steps[activeStep].activity.description}
                      </Typography>
                      
                      {/* Render the appropriate activity component */}
                      {renderActivity()}
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
