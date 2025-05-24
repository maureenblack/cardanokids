import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
  Zoom,
  Grow
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Character interface
interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
  funFact: string;
  specialPower: string;
  likes: string[];
  quote: string;
}

/**
 * CharacterIntroduction Component
 * 
 * An interactive component that introduces blockchain characters to young children
 * in a fun and engaging way.
 */
const CharacterIntroduction: React.FC = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [animateIndex, setAnimateIndex] = useState(0);
  
  // Blockchain characters
  const characters: Character[] = [
    {
      id: 'ada',
      name: 'Ada',
      role: 'Leader',
      description: 'Ada is the brave and smart leader of the Blockchain Friends. She helps everyone work together and makes sure the blockchain stays safe and fair.',
      image: 'https://img.freepik.com/free-vector/cute-girl-with-backpack-cartoon-vector-icon-illustration-people-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3753.jpg',
      color: '#5E35B1',
      funFact: 'Ada is named after Ada Lovelace, who was the world\'s first computer programmer!',
      specialPower: 'Can solve any puzzle and find solutions to difficult problems',
      likes: ['Mathematics', 'Exploring', 'Helping others', 'Building things'],
      quote: 'Together we can build a better future!'
    },
    {
      id: 'captain-block',
      name: 'Captain Block',
      role: 'Block Builder',
      description: 'Captain Block is in charge of creating new blocks for the blockchain. He carefully collects important information and adds it to blocks that connect together.',
      image: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
      color: '#1E88E5',
      funFact: 'Captain Block can build a perfect block in just 20 seconds!',
      specialPower: 'Super strength for stacking blocks securely',
      likes: ['Building', 'Organization', 'Security', 'Teamwork'],
      quote: 'One block at a time, we build something amazing!'
    },
    {
      id: 'professor-ledger',
      name: 'Professor Ledger',
      role: 'Record Keeper',
      description: 'Professor Ledger keeps track of everything that happens on the blockchain. She has a magical book that records who owns what and makes sure nobody can cheat.',
      image: 'https://img.freepik.com/free-vector/scientist-woman-concept-illustration_114360-8212.jpg',
      color: '#43A047',
      funFact: 'Professor Ledger never forgets anything she writes in her magical book!',
      specialPower: 'Perfect memory and can spot any mistake instantly',
      likes: ['Books', 'Organization', 'Teaching', 'Truth'],
      quote: 'Knowledge is power, and truth is unbreakable!'
    },
    {
      id: 'director-voltaire',
      name: 'Director Voltaire',
      role: 'Decision Maker',
      description: 'Director Voltaire helps everyone make decisions together. He makes sure everyone gets a vote and that the blockchain is fair for all.',
      image: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
      color: '#FB8C00',
      funFact: 'Director Voltaire can listen to 100 people talking at once and understand them all!',
      specialPower: 'Can help people agree even when they disagree',
      likes: ['Democracy', 'Fairness', 'Listening', 'Community'],
      quote: 'Every voice matters in our blockchain community!'
    },
    {
      id: 'security-sam',
      name: 'Security Sam',
      role: 'Protector',
      description: 'Security Sam keeps the blockchain safe from bad guys. She has special tools that make sure nobody can break the chain or change the blocks.',
      image: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
      color: '#E53935',
      funFact: 'Security Sam knows 50 different ways to protect a secret code!',
      specialPower: 'Can create unbreakable shields around the blockchain',
      likes: ['Puzzles', 'Codes', 'Protection', 'Technology'],
      quote: 'Safety first, second, and third!'
    },
    {
      id: 'wallet-wendy',
      name: 'Wallet Wendy',
      role: 'Treasure Keeper',
      description: 'Wallet Wendy helps everyone keep their digital treasures safe. She creates special wallets where you can store your tokens and NFTs.',
      image: 'https://img.freepik.com/free-vector/cute-girl-detective-cartoon-vector-icon-illustration-people-profession-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3861.jpg',
      color: '#8E24AA',
      funFact: 'Wallet Wendy can create a new wallet in just 3 seconds!',
      specialPower: 'Can find any lost digital treasure',
      likes: ['Collecting', 'Organization', 'Security', 'Helping'],
      quote: 'Your treasures are safe with me!'
    }
  ];
  
  // Handle character selection
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setOpen(true);
  };
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
  };
  
  // Handle show all characters
  const handleShowAll = () => {
    setShowAll(true);
  };
  
  // Animate characters one by one
  React.useEffect(() => {
    if (showAll && animateIndex < characters.length) {
      const timer = setTimeout(() => {
        setAnimateIndex(animateIndex + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showAll, animateIndex, characters.length]);
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Meet the Blockchain Friends!
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        These special friends work together to make the Cardano blockchain work. Click on each character to learn more about them!
      </Typography>
      
      {!showAll && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowAll}
            startIcon={<EmojiPeopleIcon />}
            size="large"
          >
            Meet the Friends!
          </Button>
        </Box>
      )}
      
      <Grid container spacing={3}>
        {characters.map((character, index) => (
          <Grow
            key={character.id}
            in={showAll && index < animateIndex}
            style={{ transformOrigin: '0 0 0' }}
            timeout={500}
          >
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                whileHover={{ scale: 1.05 }}
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
                    border: `2px solid ${character.color}`
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={character.image}
                    alt={character.name}
                    sx={{ 
                      p: 2, 
                      objectFit: 'contain',
                      backgroundColor: `${character.color}20` // 20% opacity
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: character.color }}>
                      {character.name}
                    </Typography>
                    <Chip 
                      label={character.role} 
                      size="small"
                      sx={{ 
                        mb: 2,
                        backgroundColor: character.color,
                        color: 'white'
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {character.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleSelectCharacter(character)}
                      sx={{ 
                        backgroundColor: character.color,
                        '&:hover': {
                          backgroundColor: character.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      Learn More About {character.name}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          </Grow>
        ))}
      </Grid>
      
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
        {selectedCharacter && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: selectedCharacter.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Typography variant="h5" component="div">
                {selectedCharacter.name}
              </Typography>
              <Chip 
                label={selectedCharacter.role} 
                size="small"
                sx={{ 
                  ml: 2,
                  backgroundColor: 'white',
                  color: selectedCharacter.color
                }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={5}>
                  <Box 
                    component="img"
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      border: `3px solid ${selectedCharacter.color}`,
                      mb: 2
                    }}
                  />
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: `${selectedCharacter.color}10`, // 10% opacity
                      borderRadius: 2,
                      border: `1px solid ${selectedCharacter.color}30` // 30% opacity
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ color: selectedCharacter.color, fontWeight: 'bold' }}>
                      Fun Fact:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedCharacter.funFact}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ color: selectedCharacter.color, fontWeight: 'bold' }}>
                      Special Power:
                    </Typography>
                    <Typography variant="body2">
                      {selectedCharacter.specialPower}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" paragraph>
                    {selectedCharacter.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ color: selectedCharacter.color, fontWeight: 'bold' }}>
                    {selectedCharacter.name} Likes:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {selectedCharacter.likes.map((like, index) => (
                      <Chip 
                        key={index}
                        label={like}
                        size="small"
                        sx={{ 
                          backgroundColor: `${selectedCharacter.color}20`, // 20% opacity
                          color: selectedCharacter.color,
                          borderColor: selectedCharacter.color
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      backgroundColor: `${selectedCharacter.color}10`, // 10% opacity
                      borderRadius: 2,
                      border: `1px solid ${selectedCharacter.color}30`, // 30% opacity
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ color: selectedCharacter.color, fontWeight: 'bold' }}>
                      {selectedCharacter.name}'s Favorite Quote:
                    </Typography>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', mt: 1 }}>
                      "{selectedCharacter.quote}"
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: selectedCharacter.color, fontWeight: 'bold' }}>
                      Role in the Blockchain:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedCharacter.id === 'ada' && (
                        "Ada makes sure everyone in the blockchain works together. She helps set the rules and makes sure the blockchain is fair for everyone."
                      )}
                      {selectedCharacter.id === 'captain-block' && (
                        "Captain Block creates new blocks that hold important information. He makes sure each block is connected to the one before it, creating a strong chain."
                      )}
                      {selectedCharacter.id === 'professor-ledger' && (
                        "Professor Ledger keeps track of all transactions and information on the blockchain. Her magical ledger shows who owns what and can't be changed once it's written."
                      )}
                      {selectedCharacter.id === 'director-voltaire' && (
                        "Director Voltaire helps everyone make decisions together about how the blockchain should work. He makes sure everyone gets a vote and that the community decides together."
                      )}
                      {selectedCharacter.id === 'security-sam' && (
                        "Security Sam protects the blockchain from bad actors. She uses special codes called cryptography to make sure nobody can break the chain or change information."
                      )}
                      {selectedCharacter.id === 'wallet-wendy' && (
                        "Wallet Wendy helps everyone keep their digital assets safe. She creates special wallets with keys that only the owners can use to access their treasures."
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={handleClose} 
                variant="outlined"
                sx={{ 
                  borderColor: selectedCharacter.color,
                  color: selectedCharacter.color
                }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{ 
                  backgroundColor: selectedCharacter.color,
                  '&:hover': {
                    backgroundColor: selectedCharacter.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Got It!
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {showAll && animateIndex >= characters.length && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mt: 4, 
            borderRadius: 3, 
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body1" paragraph align="center">
            Now you've met all the Blockchain Friends! They work together to make the Cardano blockchain run smoothly.
          </Typography>
          <Typography variant="body1" align="center">
            Each friend has a special job, and together they create a secure, fair, and fun blockchain for everyone to use!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CharacterIntroduction;
