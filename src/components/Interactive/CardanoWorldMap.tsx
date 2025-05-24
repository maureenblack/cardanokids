import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Zoom,
  Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ExploreIcon from '@mui/icons-material/Explore';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ParkIcon from '@mui/icons-material/Park';
import PoolIcon from '@mui/icons-material/Pool';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Location interface
interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
  funFacts: string[];
  character?: string;
  characterImage?: string;
  activities?: string[];
}

/**
 * CardanoWorldMap Component
 * 
 * An interactive map of Cardano Land that allows children to explore
 * different locations and learn about blockchain concepts.
 */
const CardanoWorldMap: React.FC = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Cardano Land locations
  const locations: Location[] = [
    {
      id: 'ada-square',
      name: 'Ada Square',
      description: 'The central hub of Cardano Land where everyone gathers. This beautiful square is named after Ada Lovelace, a brilliant mathematician and the world\'s first computer programmer!',
      image: 'https://img.freepik.com/free-vector/gradient-metaverse-concept_23-2149166922.jpg',
      x: 50,
      y: 50,
      icon: <HomeIcon />,
      color: '#5E35B1',
      funFacts: [
        'Ada Square is the oldest part of Cardano Land, built when the blockchain first started in 2017.',
        'The fountain in the middle of the square represents the flow of information in the blockchain.',
        'Every new visitor to Cardano Land starts their journey here!'
      ],
      character: 'Ada',
      characterImage: 'https://img.freepik.com/free-vector/cute-girl-with-backpack-cartoon-vector-icon-illustration-people-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3753.jpg',
      activities: [
        'Meet other blockchain explorers',
        'Learn about the history of Cardano',
        'Get a map of Cardano Land'
      ]
    },
    {
      id: 'block-tower',
      name: 'Block Tower',
      description: 'A tall tower made of connected blocks, each containing important information. The tower keeps growing as new blocks are added to the chain!',
      image: 'https://img.freepik.com/free-vector/gradient-blockchain-concept_23-2149166908.jpg',
      x: 75,
      y: 30,
      icon: <AccountBalanceIcon />,
      color: '#1E88E5',
      funFacts: [
        'Block Tower grows taller every 20 seconds when a new block is added.',
        'Each block in the tower contains hundreds of transactions and information.',
        'The tower is currently over 8 million blocks tall!'
      ],
      character: 'Captain Block',
      characterImage: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
      activities: [
        'Watch new blocks being added to the chain',
        'Learn how blocks connect together',
        'Create your own mini block'
      ]
    },
    {
      id: 'ledger-library',
      name: 'Ledger Library',
      description: 'A magical library where every transaction ever made on Cardano is recorded in special books. Professor Ledger makes sure all the records are accurate and organized.',
      image: 'https://img.freepik.com/free-vector/gradient-crypto-concept_23-2149166905.jpg',
      x: 25,
      y: 30,
      icon: <SchoolIcon />,
      color: '#43A047',
      funFacts: [
        'The Ledger Library contains a perfect copy of every transaction ever made on Cardano.',
        'The books in the library can\'t be changed once they\'re written - just like the blockchain!',
        'If you tried to read all the books, it would take you over 100 years!'
      ],
      character: 'Professor Ledger',
      characterImage: 'https://img.freepik.com/free-vector/scientist-woman-concept-illustration_114360-8212.jpg',
      activities: [
        'Search for transactions in the magical books',
        'Learn how the blockchain keeps records',
        'Create your own ledger entry'
      ]
    },
    {
      id: 'voltaire-valley',
      name: 'Voltaire Valley',
      description: 'A beautiful valley where everyone in Cardano Land comes to make important decisions together. Director Voltaire helps make sure everyone\'s voice is heard.',
      image: 'https://img.freepik.com/free-vector/hand-drawn-nft-concept_23-2149199088.jpg',
      x: 50,
      y: 75,
      icon: <ParkIcon />,
      color: '#FB8C00',
      funFacts: [
        'Voltaire Valley is named after a philosopher who believed in democracy and free speech.',
        'Important decisions about Cardano are made here through voting.',
        'The valley has special voting booths where people can propose new ideas for Cardano Land.'
      ],
      character: 'Director Voltaire',
      characterImage: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
      activities: [
        'Participate in a mini-vote',
        'Propose ideas for improving Cardano Land',
        'Learn how blockchain governance works'
      ]
    },
    {
      id: 'security-springs',
      name: 'Security Springs',
      description: 'A peaceful area with magical springs that create protective shields for Cardano Land. Security Sam uses these springs to keep the blockchain safe from bad actors.',
      image: 'https://img.freepik.com/free-vector/gradient-metaverse-concept_23-2149166922.jpg',
      x: 25,
      y: 75,
      icon: <PoolIcon />,
      color: '#E53935',
      funFacts: [
        'The magical waters of Security Springs can detect any attempt to tamper with the blockchain.',
        'The springs use special cryptography magic to create unbreakable codes.',
        'Security Sam tests the springs every day to make sure they\'re working properly.'
      ],
      character: 'Security Sam',
      characterImage: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
      activities: [
        'Create your own secret code',
        'Test the security of the springs',
        'Learn how cryptography protects the blockchain'
      ]
    },
    {
      id: 'wallet-woods',
      name: 'Wallet Woods',
      description: 'A magical forest where special wallet trees grow. Each tree produces secure wallets where people can store their digital treasures. Wallet Wendy takes care of the forest.',
      image: 'https://img.freepik.com/free-vector/gradient-nft-concept_23-2149166903.jpg',
      x: 75,
      y: 75,
      icon: <PetsIcon />,
      color: '#8E24AA',
      funFacts: [
        'Each wallet tree produces a unique wallet with its own special key.',
        'The keys to wallets are like magical seeds that only the owner can use.',
        'Wallet Woods has over a million trees, one for each Cardano user!'
      ],
      character: 'Wallet Wendy',
      characterImage: 'https://img.freepik.com/free-vector/cute-girl-detective-cartoon-vector-icon-illustration-people-profession-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3861.jpg',
      activities: [
        'Create your own practice wallet',
        'Learn how to keep digital treasures safe',
        'Explore different types of wallets'
      ]
    }
  ];
  
  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setOpen(true);
    
    // Mark as visited
    if (!visited.includes(location.id)) {
      setVisited([...visited, location.id]);
    }
  };
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
  };
  
  // Handle start exploration
  const handleStartExploration = () => {
    setShowIntro(false);
    setShowMap(true);
  };
  
  // Calculate progress
  const progress = Math.round((visited.length / locations.length) * 100);
  
  // Check if all locations visited
  const allVisited = visited.length === locations.length;
  
  return (
    <Box sx={{ my: 4 }}>
      {showIntro && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundImage: 'url(https://img.freepik.com/free-vector/gradient-metaverse-concept_23-2149166922.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                mb: 4
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  zIndex: 0
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Welcome to Cardano Land!
                </Typography>
                
                <Typography variant="h6" paragraph>
                  An exciting world where blockchain comes to life!
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Cardano Land is a magical place where blockchain technology is brought to life through fun characters and exciting locations. Here, you'll meet the Blockchain Friends and explore different parts of the Cardano blockchain.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Click on different locations on the map to learn about blockchain concepts and collect knowledge badges. Can you visit all the locations and become a Cardano Explorer?
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleStartExploration}
                  startIcon={<ExploreIcon />}
                  sx={{
                    mt: 2,
                    backgroundColor: 'white',
                    color: theme.palette[ageGroup].main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Start Exploring Cardano Land!
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>
      )}
      
      {showMap && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 4,
                mb: 4,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Cardano Land Map
                </Typography>
                
                <Chip 
                  icon={<MapIcon />}
                  label={`${visited.length}/${locations.length} Locations Visited`}
                  color={allVisited ? 'success' : 'primary'}
                  variant={allVisited ? 'filled' : 'outlined'}
                />
              </Box>
              
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 500,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 2,
                  backgroundImage: 'url(https://img.freepik.com/free-vector/hand-drawn-fantasy-map_23-2149088106.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden'
                }}
              >
                {locations.map((location) => (
                  <Tooltip
                    key={location.id}
                    title={visited.includes(location.id) ? `${location.name} (Visited)` : location.name}
                    arrow
                    placement="top"
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: `${location.x}%`,
                        top: `${location.y}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: visited.includes(location.id) ? location.color : 'white',
                        color: visited.includes(location.id) ? 'white' : location.color,
                        border: `2px solid ${location.color}`,
                        '&:hover': {
                          backgroundColor: location.color,
                          color: 'white'
                        },
                        transition: 'all 0.3s ease',
                        zIndex: 10
                      }}
                      onClick={() => handleSelectLocation(location)}
                    >
                      {location.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Click on the locations to learn more about Cardano Land!
                </Typography>
              </Box>
            </Paper>
            
            <Grid container spacing={3}>
              {locations.map((location) => (
                <Grid item xs={12} sm={6} md={4} key={location.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: visited.includes(location.id) ? `0 4px 12px ${location.color}40` : 3,
                      border: visited.includes(location.id) ? `2px solid ${location.color}` : 'none',
                      opacity: visited.includes(location.id) ? 1 : 0.7,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardActionArea onClick={() => handleSelectLocation(location)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={location.image}
                        alt={location.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              mr: 1, 
                              color: location.color,
                              display: 'flex'
                            }}
                          >
                            {location.icon}
                          </Box>
                          <Typography variant="h6" component="div">
                            {location.name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {location.description.substring(0, 100)}...
                        </Typography>
                        
                        {visited.includes(location.id) ? (
                          <Chip 
                            label="Visited" 
                            size="small"
                            color="success"
                            icon={<CheckCircleIcon />}
                          />
                        ) : (
                          <Chip 
                            label="Not Visited Yet" 
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {allVisited && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mt: 4, 
                  borderRadius: 3, 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: 'success.main' }}>
                  Congratulations, Explorer!
                </Typography>
                <Typography variant="body1" paragraph>
                  You've visited all the locations in Cardano Land and learned about the different parts of the blockchain!
                </Typography>
                <Typography variant="body1">
                  You're now ready to continue your blockchain adventure with more advanced concepts!
                </Typography>
              </Paper>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {selectedLocation && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: selectedLocation.color,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>
                  {selectedLocation.icon}
                </Box>
                <Typography variant="h5" component="div">
                  {selectedLocation.name}
                </Typography>
              </Box>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img"
                    src={selectedLocation.image}
                    alt={selectedLocation.name}
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      mb: 2
                    }}
                  />
                  
                  {selectedLocation.character && selectedLocation.characterImage && (
                    <Card 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        border: `1px solid ${selectedLocation.color}30` // 30% opacity
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={selectedLocation.characterImage}
                          alt={selectedLocation.character}
                          sx={{ 
                            width: 60, 
                            height: 60,
                            mr: 2,
                            border: `2px solid ${selectedLocation.color}`
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: selectedLocation.color, fontWeight: 'bold' }}>
                            Guide: {selectedLocation.character}
                          </Typography>
                          <Typography variant="body2">
                            Welcome to {selectedLocation.name}! I'm here to show you around and teach you about this special place in Cardano Land.
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: `${selectedLocation.color}10`, // 10% opacity
                      borderRadius: 2,
                      border: `1px solid ${selectedLocation.color}30` // 30% opacity
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ color: selectedLocation.color, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                      Fun Facts:
                    </Typography>
                    <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                      {selectedLocation.funFacts.map((fact, index) => (
                        <li key={index}>
                          <Typography variant="body2" paragraph>
                            {fact}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph>
                    {selectedLocation.description}
                  </Typography>
                  
                  {selectedLocation.activities && (
                    <>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: selectedLocation.color, fontWeight: 'bold', mt: 3 }}>
                        Activities at {selectedLocation.name}:
                      </Typography>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          borderRadius: 2
                        }}
                      >
                        {selectedLocation.activities.map((activity, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label={index + 1} 
                              size="small"
                              sx={{ 
                                mr: 1,
                                backgroundColor: selectedLocation.color,
                                color: 'white'
                              }}
                            />
                            <Typography variant="body2">
                              {activity}
                            </Typography>
                          </Box>
                        ))}
                      </Paper>
                    </>
                  )}
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ color: selectedLocation.color, fontWeight: 'bold', mt: 3 }}>
                    What You'll Learn:
                  </Typography>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: 2
                    }}
                  >
                    {selectedLocation.id === 'ada-square' && (
                      <Typography variant="body2" paragraph>
                        At Ada Square, you'll learn about the history of Cardano and how it was created to be a blockchain platform that's secure, scalable, and sustainable. Just like Ada Square is the center of Cardano Land, the Cardano blockchain is designed to be a central platform for many different applications!
                      </Typography>
                    )}
                    {selectedLocation.id === 'block-tower' && (
                      <Typography variant="body2" paragraph>
                        At Block Tower, you'll discover how blockchains store information in blocks that are linked together. Each block contains transactions and other important data. The blocks are connected in a specific order, creating a chain that can't be broken. This is why it's called a "blockchain"!
                      </Typography>
                    )}
                    {selectedLocation.id === 'ledger-library' && (
                      <Typography variant="body2" paragraph>
                        At Ledger Library, you'll learn about the distributed ledger - a special record book that keeps track of all transactions on the blockchain. Unlike regular books that can be changed, once something is written in the blockchain ledger, it can't be erased or changed. This makes it perfect for keeping track of who owns what!
                      </Typography>
                    )}
                    {selectedLocation.id === 'voltaire-valley' && (
                      <Typography variant="body2" paragraph>
                        At Voltaire Valley, you'll explore how decisions are made in a blockchain community. In Cardano, everyone who owns ADA (Cardano's cryptocurrency) can vote on important changes and improvements. This is called "governance" and it ensures that Cardano belongs to its community, not just a few people in charge!
                      </Typography>
                    )}
                    {selectedLocation.id === 'security-springs' && (
                      <Typography variant="body2" paragraph>
                        At Security Springs, you'll discover how cryptography (secret codes) keeps the blockchain secure. Special mathematical puzzles and digital signatures make sure that only the right people can access their digital assets and that nobody can tamper with the blockchain. It's like having the world's best lock on your treasure chest!
                      </Typography>
                    )}
                    {selectedLocation.id === 'wallet-woods' && (
                      <Typography variant="body2" paragraph>
                        At Wallet Woods, you'll learn about digital wallets - special tools that let you store and manage your digital assets on the blockchain. Each wallet has a public address (like your mailbox) and a private key (like your house key). The public address lets people send you things, while the private key lets only you access what's inside!
                      </Typography>
                    )}
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Chip 
                      icon={visited.includes(selectedLocation.id) ? <CheckCircleIcon /> : <ExploreIcon />}
                      label={visited.includes(selectedLocation.id) ? "Location Visited!" : "Visit This Location"}
                      color={visited.includes(selectedLocation.id) ? "success" : "primary"}
                      sx={{ 
                        px: 2,
                        py: 3,
                        backgroundColor: visited.includes(selectedLocation.id) ? 'success.main' : selectedLocation.color,
                        '& .MuiChip-label': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
              <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{ 
                  backgroundColor: selectedLocation.color,
                  '&:hover': {
                    backgroundColor: selectedLocation.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                {visited.includes(selectedLocation.id) ? "Return to Map" : "Mark as Visited"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

// For TypeScript
const CheckCircleIcon = () => <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>✓</Box>;

export default CardanoWorldMap;
