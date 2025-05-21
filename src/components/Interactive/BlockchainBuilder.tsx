import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Define the Block interface
interface Block {
  id: number;
  data: string;
  hash: string;
  previousHash: string;
  timestamp: number;
}

/**
 * BlockchainBuilder Component
 * 
 * An interactive component that teaches children how blockchain works through
 * a visual building blocks metaphor. Children can add blocks to the chain,
 * see how blocks link together, and understand basic blockchain concepts.
 */
const BlockchainBuilder: React.FC = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [newBlockData, setNewBlockData] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Initialize the blockchain with a genesis block
  useEffect(() => {
    if (blockchain.length === 0) {
      const genesisBlock: Block = {
        id: 0,
        data: 'Genesis Block',
        hash: generateSimpleHash('Genesis Block', '0'),
        previousHash: '0',
        timestamp: Date.now()
      };
      setBlockchain([genesisBlock]);
    }
  }, [blockchain.length]);

  // Generate a simple hash for educational purposes
  const generateSimpleHash = (data: string, previousHash: string): string => {
    // This is a simplified hash function for educational purposes
    // In a real blockchain, this would be a cryptographic hash function
    const combinedString = data + previousHash + Date.now();
    let hash = '';
    for (let i = 0; i < combinedString.length; i++) {
      hash += combinedString.charCodeAt(i).toString(16);
    }
    return hash.slice(0, 8); // Keep it short for kids
  };

  // Add a new block to the blockchain
  const addBlock = () => {
    if (!newBlockData.trim()) return;
    
    setIsAnimating(true);
    
    const lastBlock = blockchain[blockchain.length - 1];
    const newBlock: Block = {
      id: lastBlock.id + 1,
      data: newBlockData,
      hash: generateSimpleHash(newBlockData, lastBlock.hash),
      previousHash: lastBlock.hash,
      timestamp: Date.now()
    };
    
    setTimeout(() => {
      setBlockchain([...blockchain, newBlock]);
      setNewBlockData('');
      setIsAnimating(false);
    }, 1000);
  };

  // Render a single block
  const renderBlock = (block: Block, index: number) => {
    const isGenesis = index === 0;
    const blockColor = isGenesis 
      ? theme.palette[ageGroup].dark 
      : theme.palette[ageGroup].main;
    
    return (
      <motion.div
        key={block.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            m: 2,
            borderRadius: 4,
            backgroundColor: blockColor,
            color: '#fff',
            position: 'relative',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              {isGenesis ? 'First Block' : `Block #${block.id}`}
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {block.data}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Tooltip title="This is the block's special code">
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <LockIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Hash: {block.hash}
              </Typography>
            </Tooltip>
            
            {!isGenesis && (
              <Tooltip title="This connects to the previous block">
                <Typography variant="caption" display="block">
                  <LinkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Previous: {block.previousHash.slice(0, 6)}...
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Paper>
        
        {index < blockchain.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <LinkIcon fontSize="large" color="primary" />
            </motion.div>
          </Box>
        )}
      </motion.div>
    );
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Build Your Own Blockchain!
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Add blocks to create your very own blockchain. Each block connects to the one before it!
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => setShowExplanation(!showExplanation)}
        sx={{ mb: 3, display: 'block', mx: 'auto' }}
      >
        {showExplanation ? 'Hide Explanation' : 'What is a Blockchain?'}
      </Button>
      
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 3, 
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                border: '1px dashed rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="body1" paragraph>
                A blockchain is like a special chain of building blocks. Each block contains information and is connected to the block before it.
              </Typography>
              <Typography variant="body1" paragraph>
                When you add a new block, it gets a special code (called a "hash") that depends on what's inside the block AND the code from the previous block.
              </Typography>
              <Typography variant="body1">
                This makes the blockchain very secure - if someone tries to change a block, all the blocks that come after it would need to change too!
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={8} component="div">
          <TextField
            fullWidth
            label="What do you want to put in your block?"
            variant="outlined"
            value={newBlockData}
            onChange={(e) => setNewBlockData(e.target.value)}
            disabled={isAnimating}
            placeholder="Type something like 'My favorite color is blue'"
          />
        </Grid>
        <Grid item xs={12} sm={4} component="div">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={addBlock}
            disabled={!newBlockData.trim() || isAnimating}
            sx={{ height: '100%' }}
            startIcon={<AddCircleIcon />}
          >
            Add Block
          </Button>
        </Grid>
      </Grid>
      
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min-content' }}>
          {blockchain.map(renderBlock)}
        </Box>
      </Box>
      
      {blockchain.length > 1 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Wow! You've built a blockchain with {blockchain.length} blocks!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Each block is connected to the one before it, creating a secure chain.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BlockchainBuilder;
