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
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  Zoom,
  Grow
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PaletteIcon from '@mui/icons-material/Palette';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Digital Treasure interface
interface DigitalTreasure {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'art' | 'collectible' | 'badge' | 'ticket';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  owner: string;
  creator: string;
  tokenId: string;
  locked: boolean;
}

// User interface
interface User {
  id: string;
  name: string;
  avatar: string;
}

/**
 * DigitalTreasureChest Component
 * 
 * An interactive component that teaches children about digital ownership
 * and NFTs through a fun treasure collection experience.
 */
const DigitalTreasureChest: React.FC = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [treasures, setTreasures] = useState<DigitalTreasure[]>([]);
  const [selectedTreasure, setSelectedTreasure] = useState<DigitalTreasure | null>(null);
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user1',
    name: 'Cardano Kid',
    avatar: 'https://img.freepik.com/free-vector/cute-boy-avatar_1308-85700.jpg'
  });
  
  // Form state for creating a new treasure
  const [newTreasureName, setNewTreasureName] = useState('');
  const [newTreasureDescription, setNewTreasureDescription] = useState('');
  const [newTreasureType, setNewTreasureType] = useState<'art' | 'collectible' | 'badge' | 'ticket'>('art');
  
  // Initial treasures
  const initialTreasures: DigitalTreasure[] = [
    {
      id: 'treasure1',
      name: 'Golden Blockchain Badge',
      description: 'A special badge awarded to blockchain explorers who understand how blocks connect together.',
      image: 'https://img.freepik.com/free-vector/gradient-crypto-logo-template_23-2149195391.jpg',
      type: 'badge',
      rarity: 'rare',
      owner: 'user2',
      creator: 'Cardano Kids',
      tokenId: 'badge123',
      locked: true
    },
    {
      id: 'treasure2',
      name: 'Cardano Land Ticket',
      description: 'A special ticket that grants access to all areas of Cardano Land.',
      image: 'https://img.freepik.com/free-vector/gradient-crypto-logo-template_23-2149195391.jpg',
      type: 'ticket',
      rarity: 'uncommon',
      owner: 'user3',
      creator: 'Cardano Kids',
      tokenId: 'ticket456',
      locked: true
    },
    {
      id: 'treasure3',
      name: 'Blockchain Buddy',
      description: 'A cute digital pet that lives on the blockchain. It can never be lost or copied!',
      image: 'https://img.freepik.com/free-vector/gradient-crypto-logo-template_23-2149195391.jpg',
      type: 'collectible',
      rarity: 'legendary',
      owner: 'user1',
      creator: 'Ada',
      tokenId: 'pet789',
      locked: false
    }
  ];
  
  // Load initial treasures
  useEffect(() => {
    setTreasures(initialTreasures);
  }, []);
  
  // Generate a unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Generate a token ID
  const generateTokenId = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };
  
  // Handle treasure selection
  const handleSelectTreasure = (treasure: DigitalTreasure) => {
    setSelectedTreasure(treasure);
    setOpen(true);
  };
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
  };
  
  // Handle create dialog open
  const handleCreateOpen = () => {
    setCreateOpen(true);
  };
  
  // Handle create dialog close
  const handleCreateClose = () => {
    setCreateOpen(false);
  };
  
  // Handle start exploration
  const handleStartExploration = () => {
    setShowIntro(false);
  };
  
  // Handle creating a new treasure
  const handleCreateTreasure = () => {
    if (!newTreasureName) return;
    
    const newTreasure: DigitalTreasure = {
      id: generateId(),
      name: newTreasureName,
      description: newTreasureDescription || 'My special digital treasure',
      image: 'https://img.freepik.com/free-vector/gradient-nft-concept_23-2149166903.jpg',
      type: newTreasureType,
      rarity: 'uncommon',
      owner: currentUser.id,
      creator: currentUser.name,
      tokenId: generateTokenId(),
      locked: false
    };
    
    setTreasures([...treasures, newTreasure]);
    setNewTreasureName('');
    setNewTreasureDescription('');
    setCreateOpen(false);
  };
  
  // Handle transferring a treasure
  const handleTransferTreasure = (treasure: DigitalTreasure) => {
    // In a real app, this would open a transfer dialog
    // For now, we'll just toggle the locked state
    const updatedTreasures = treasures.map(t => {
      if (t.id === treasure.id) {
        return { ...t, locked: !t.locked };
      }
      return t;
    });
    
    setTreasures(updatedTreasures);
    setSelectedTreasure(selectedTreasure ? { ...selectedTreasure, locked: !selectedTreasure.locked } : null);
  };
  
  // Get color for rarity
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#78909C';
      case 'uncommon':
        return '#4CAF50';
      case 'rare':
        return '#2196F3';
      case 'legendary':
        return '#FFC107';
      default:
        return '#78909C';
    }
  };
  
  // Get icon for treasure type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'art':
        return <PaletteIcon />;
      case 'collectible':
        return <CardGiftcardIcon />;
      case 'badge':
        return <EmojiEventsIcon />;
      case 'ticket':
        return <CardGiftcardIcon />;
      default:
        return <CardGiftcardIcon />;
    }
  };
  
  return (
    <Box sx={{ my: 4 }}>
      {showIntro ? (
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
                backgroundImage: 'url(https://img.freepik.com/free-vector/gradient-nft-concept_23-2149166903.jpg)',
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
                  Digital Treasures
                </Typography>
                
                <Typography variant="h6" paragraph>
                  Discover the magic of owning special digital items on the blockchain!
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Digital treasures are special items that exist on computers, like pictures, badges, or collectibles. Unlike regular digital things that can be copied many times, blockchain treasures are unique and can truly belong to just one person at a time!
                </Typography>
                
                <Typography variant="body1" paragraph>
                  In this activity, you'll learn about digital ownership, create your own digital treasures, and see how the blockchain keeps track of who owns what.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleStartExploration}
                  startIcon={<CardGiftcardIcon />}
                  sx={{
                    mt: 2,
                    backgroundColor: 'white',
                    color: theme.palette[ageGroup].main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Open Treasure Chest!
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" component="h2">
                My Digital Treasure Chest
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOpen}
                startIcon={<AddCircleIcon />}
              >
                Create New Treasure
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {treasures.map((treasure) => (
                <Grid item xs={12} sm={6} md={4} key={treasure.id}>
                  <Grow in={true} timeout={500}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: 3,
                        border: treasure.owner === currentUser.id ? `2px solid ${theme.palette[ageGroup].main}` : 'none',
                        position: 'relative'
                      }}
                    >
                      {treasure.locked && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                          }}
                        >
                          <LockIcon sx={{ fontSize: 60, color: 'white' }} />
                        </Box>
                      )}
                      
                      <CardMedia
                        component="img"
                        height="140"
                        image={treasure.image}
                        alt={treasure.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" noWrap sx={{ maxWidth: '70%' }}>
                            {treasure.name}
                          </Typography>
                          <Chip 
                            label={treasure.rarity} 
                            size="small"
                            sx={{ 
                              backgroundColor: getRarityColor(treasure.rarity),
                              color: 'white'
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ mr: 1, color: 'text.secondary' }}>
                            {getTypeIcon(treasure.type)}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {treasure.type.charAt(0).toUpperCase() + treasure.type.slice(1)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                          {treasure.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Owner: {treasure.owner === currentUser.id ? 'You' : 'Someone else'}
                          </Typography>
                          
                          <Tooltip title={`Token ID: ${treasure.tokenId}`}>
                            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'help' }}>
                              #{treasure.tokenId.substring(0, 6)}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => handleSelectTreasure(treasure)}
                          sx={{ mr: 1 }}
                        >
                          View Details
                        </Button>
                        
                        {treasure.owner === currentUser.id && (
                          <Button 
                            size="small"
                            color={treasure.locked ? 'success' : 'primary'}
                            startIcon={treasure.locked ? <LockOpenIcon /> : <LockIcon />}
                            onClick={() => handleTransferTreasure(treasure)}
                          >
                            {treasure.locked ? 'Unlock' : 'Lock'}
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            
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
              <Typography variant="h6" gutterBottom>
                What are Digital Treasures?
              </Typography>
              <Typography variant="body1" paragraph>
                Digital treasures are special items that exist on computers, like pictures, badges, or collectibles. On the blockchain, these treasures are called NFTs (Non-Fungible Tokens).
              </Typography>
              <Typography variant="body1" paragraph>
                What makes blockchain treasures special:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <LockIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      True Ownership
                    </Typography>
                    <Typography variant="body2">
                      The blockchain keeps a perfect record of who owns what, and it can't be changed without permission.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <CardGiftcardIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Unique & Special
                    </Typography>
                    <Typography variant="body2">
                      Each digital treasure is one-of-a-kind or limited in number, making them rare and special.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <PaletteIcon sx={{ fontSize: 40, color: theme.palette[ageGroup].main, mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Creative Expression
                    </Typography>
                    <Typography variant="body2">
                      Digital treasures can be art, collectibles, badges, tickets, or anything you can imagine!
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Treasure Detail Dialog */}
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
        {selectedTreasure && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: getRarityColor(selectedTreasure.rarity),
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>
                  {getTypeIcon(selectedTreasure.type)}
                </Box>
                <Typography variant="h5" component="div">
                  {selectedTreasure.name}
                </Typography>
              </Box>
              <Chip 
                label={selectedTreasure.rarity.toUpperCase()} 
                size="small"
                sx={{ 
                  backgroundColor: 'white',
                  color: getRarityColor(selectedTreasure.rarity)
                }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img"
                    src={selectedTreasure.image}
                    alt={selectedTreasure.name}
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      mb: 2,
                      border: `1px solid ${getRarityColor(selectedTreasure.rarity)}30` // 30% opacity
                    }}
                  />
                  
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Blockchain Information:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Token ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {selectedTreasure.tokenId}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Creator:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {selectedTreasure.creator}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Owner:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {selectedTreasure.owner === currentUser.id ? 'You' : selectedTreasure.owner}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Status:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Chip 
                          icon={selectedTreasure.locked ? <LockIcon /> : <LockOpenIcon />}
                          label={selectedTreasure.locked ? 'Locked' : 'Unlocked'} 
                          size="small"
                          color={selectedTreasure.locked ? 'error' : 'success'}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph>
                    {selectedTreasure.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    What makes this treasure special?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This digital treasure is stored on the blockchain, which means:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2" paragraph>
                        It's unique and can't be copied or duplicated
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        The blockchain keeps a perfect record of who created it and who owns it
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        It can be transferred to someone else, just like a physical object
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        It will always exist on the blockchain, even if websites or apps change
                      </Typography>
                    </li>
                  </ul>
                  
                  {selectedTreasure.owner === currentUser.id && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color={selectedTreasure.locked ? 'success' : 'primary'}
                        startIcon={selectedTreasure.locked ? <LockOpenIcon /> : <LockIcon />}
                        onClick={() => handleTransferTreasure(selectedTreasure)}
                        fullWidth
                      >
                        {selectedTreasure.locked ? 'Unlock Treasure' : 'Lock Treasure'}
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Create Treasure Dialog */}
      <Dialog
        open={createOpen}
        onClose={handleCreateClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle>
          Create New Digital Treasure
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Treasure Name"
              variant="outlined"
              value={newTreasureName}
              onChange={(e) => setNewTreasureName(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={newTreasureDescription}
              onChange={(e) => setNewTreasureDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>
              Treasure Type:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {(['art', 'collectible', 'badge', 'ticket'] as const).map((type) => (
                <Grid item xs={3} key={type}>
                  <Card 
                    sx={{ 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      border: newTreasureType === type ? `2px solid ${theme.palette[ageGroup].main}` : '1px solid rgba(0, 0, 0, 0.12)',
                      backgroundColor: newTreasureType === type ? `${theme.palette[ageGroup].light}20` : 'transparent'
                    }}
                    onClick={() => setNewTreasureType(type)}
                  >
                    <CardContent>
                      <Box sx={{ color: newTreasureType === type ? theme.palette[ageGroup].main : 'text.secondary' }}>
                        {getTypeIcon(type)}
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="body2" color="text.secondary">
              When you create a digital treasure, it will be stored on the blockchain with a unique token ID. You will be the owner and creator of this treasure.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCreateClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateTreasure}
            disabled={!newTreasureName}
          >
            Create Treasure
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DigitalTreasureChest;
