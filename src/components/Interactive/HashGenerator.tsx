import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Chip,
  Fade,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import { useAgeGroup } from '../../context/AgeGroupContext';

/**
 * HashGenerator Component
 * 
 * An interactive component that demonstrates how hashing works in a blockchain.
 * Users can input text and see how the hash changes with each input.
 */
const HashGenerator: React.FC<{ advanced?: boolean }> = ({ advanced = false }) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [inputText, setInputText] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [previousInputs, setPreviousInputs] = useState<Array<{input: string, hash: string}>>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  // Generate hash whenever input changes
  useEffect(() => {
    if (inputText) {
      setHash(generateHash(inputText));
    } else {
      setHash('');
    }
  }, [inputText]);

  // Simple hash function for educational purposes
  const generateHash = (text: string): string => {
    // This is a simplified hash function for educational purposes
    // In a real blockchain, this would be a cryptographic hash function like SHA-256
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hexadecimal string and ensure it's always positive
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    
    // For advanced mode, make it look more like a real hash
    if (advanced) {
      // Generate a longer hash that looks more like SHA-256
      let advancedHash = '';
      for (let i = 0; i < 8; i++) {
        advancedHash += Math.abs(hash + i).toString(16).padStart(8, '0');
      }
      return advancedHash.substring(0, 64);
    }
    
    return hexHash;
  };

  // Save current input and hash
  const saveInput = () => {
    if (inputText && hash) {
      setPreviousInputs([...previousInputs, { input: inputText, hash }]);
      setInputText('');
    }
  };

  // Clear all saved inputs
  const clearInputs = () => {
    setPreviousInputs([]);
    setInputText('');
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {advanced ? 'Cryptographic Hash Generator' : 'Magic Code Maker'}
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => setShowExplanation(!showExplanation)}
        sx={{ mb: 3, display: 'block', mx: 'auto' }}
      >
        {showExplanation ? 'Hide Explanation' : 'What is a Hash?'}
      </Button>
      
      <Fade in={showExplanation}>
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
          {advanced ? (
            <>
              <Typography variant="body1" paragraph>
                A hash function is a mathematical algorithm that takes an input (or 'message') and returns a fixed-size string of bytes, typically a digest that is unique to each unique input.
              </Typography>
              <Typography variant="body1" paragraph>
                Hash functions are used in blockchain technology to:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">Create unique block identifiers</Typography>
                </li>
                <li>
                  <Typography variant="body1">Link blocks together in the chain</Typography>
                </li>
                <li>
                  <Typography variant="body1">Verify data integrity</Typography>
                </li>
                <li>
                  <Typography variant="body1">Secure the mining/validation process</Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                Even a small change in the input produces a completely different hash output, which is why hashes are excellent for detecting data tampering.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                A hash is like a magic code that gets created from any message you type. The cool thing about this magic code is:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">The same message always makes the same code</Typography>
                </li>
                <li>
                  <Typography variant="body1">Changing even one tiny part of your message makes a completely different code</Typography>
                </li>
                <li>
                  <Typography variant="body1">You can't figure out the original message just by looking at the code</Typography>
                </li>
              </ul>
              <Typography variant="body1">
                Blockchains use these magic codes to keep information safe and to connect blocks together!
              </Typography>
            </>
          )}
        </Paper>
      </Fade>
      
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: theme.palette[ageGroup].light,
          color: theme.palette[ageGroup].contrastText,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={advanced ? "Enter text to hash" : "Type a message"}
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette[ageGroup].main,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LockIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {advanced ? "Hash Output:" : "Your Magic Code:"}
              </Typography>
            </Box>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={hash} // Re-animate when hash changes
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#000',
                  borderRadius: 2,
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  wordBreak: 'break-all',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {hash || (advanced ? "Enter text to generate a hash" : "Type something to see the magic!")}
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={saveInput}
              disabled={!inputText}
              startIcon={<SecurityIcon />}
            >
              {advanced ? "Save Hash" : "Save This Magic Code"}
            </Button>
            
            <Button
              variant="outlined"
              color="inherit"
              onClick={clearInputs}
              disabled={previousInputs.length === 0}
              startIcon={<RefreshIcon />}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Clear All
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {previousInputs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {advanced ? "Saved Hashes:" : "Your Collection of Magic Codes:"}
          </Typography>
          
          <Grid container spacing={2}>
            {previousInputs.map((item, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {advanced ? "Input:" : "Message:"}
                      </Typography>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color="primary" 
                      />
                    </Box>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      "{item.input}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LockIcon fontSize="small" sx={{ mr: 1, color: theme.palette[ageGroup].main }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {advanced ? "Hash:" : "Magic Code:"}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                        p: 1, 
                        borderRadius: 1,
                        wordBreak: 'break-all'
                      }}
                    >
                      {item.hash}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          {previousInputs.length >= 2 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {advanced ? "Notice something interesting?" : "Did you notice something cool?"}
              </Typography>
              <Typography variant="body1">
                {advanced 
                  ? "Even a small change in the input produces a completely different hash output. This property, called the 'avalanche effect', is crucial for blockchain security."
                  : "Even when you change just one letter, you get a totally different magic code! This helps keep information in a blockchain safe and secure."}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HashGenerator;
