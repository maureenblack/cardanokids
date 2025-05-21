import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TokenIcon from '@mui/icons-material/Token';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Token interface
interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  quantity: number;
  color: string;
  icon: string;
  metadata: Record<string, string>;
}

// Available token icons
const tokenIcons = [
  '🪙', '🌟', '🎮', '🎨', '🎵', '📚', '🏆', '💎', '🚀', '🌈',
  '🦄', '🐉', '🦁', '🐬', '🦊', '🐢', '🦉', '🦋', '🌺', '🌴'
];

// Available token colors
const tokenColors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
  '#33FFF5', '#FF5733', '#C733FF', '#33FFBD', '#FF8333'
];

/**
 * TokenCreator Component
 * 
 * An interactive component that allows children to create their own tokens
 * on a simulated Cardano blockchain.
 */
const TokenCreator: React.FC<{ advanced?: boolean }> = ({ advanced = false }) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  // Token form state
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDescription, setTokenDescription] = useState<string>('');
  const [tokenQuantity, setTokenQuantity] = useState<number>(100);
  const [tokenColor, setTokenColor] = useState<string>(tokenColors[0]);
  const [tokenIcon, setTokenIcon] = useState<string>(tokenIcons[0]);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Advanced metadata fields
  const [metadataFields, setMetadataFields] = useState<Array<{key: string, value: string}>>([]);
  
  // Generate a unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Handle token creation
  const createToken = () => {
    if (!tokenName || !tokenSymbol) return;
    
    // Convert metadata array to object
    const metadata: Record<string, string> = {};
    metadataFields.forEach(field => {
      if (field.key && field.value) {
        metadata[field.key] = field.value;
      }
    });
    
    const newToken: Token = {
      id: generateId(),
      name: tokenName,
      symbol: tokenSymbol.toUpperCase(),
      description: tokenDescription,
      quantity: tokenQuantity,
      color: tokenColor,
      icon: tokenIcon,
      metadata
    };
    
    setTokens([...tokens, newToken]);
    resetForm();
  };
  
  // Reset the form
  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setTokenDescription('');
    setTokenQuantity(100);
    setTokenColor(tokenColors[0]);
    setTokenIcon(tokenIcons[0]);
    setMetadataFields([]);
    setShowForm(false);
  };
  
  // Delete a token
  const deleteToken = (id: string) => {
    setTokens(tokens.filter(token => token.id !== id));
  };
  
  // Add a metadata field
  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };
  
  // Update a metadata field
  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...metadataFields];
    updatedFields[index][field] = value;
    setMetadataFields(updatedFields);
  };
  
  // Remove a metadata field
  const removeMetadataField = (index: number) => {
    const updatedFields = [...metadataFields];
    updatedFields.splice(index, 1);
    setMetadataFields(updatedFields);
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {advanced ? 'Cardano Native Token Creator' : 'Create Your Own Token!'}
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => setShowExplanation(!showExplanation)}
        sx={{ mb: 3, display: 'block', mx: 'auto' }}
      >
        {showExplanation ? 'Hide Explanation' : 'What are Tokens?'}
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
              {advanced ? (
                <>
                  <Typography variant="body1" paragraph>
                    Cardano native tokens allow users to create custom tokens directly on the blockchain without smart contracts. This makes them more efficient and secure.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Key features of Cardano native tokens:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">They're treated the same way as ADA by the ledger</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">No need for smart contracts to handle them</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Can store metadata on-chain</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Can represent real-world assets, digital items, or custom currencies</Typography>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <Typography variant="body1" paragraph>
                    Tokens are like digital coins or collectibles that you can create, own, and share with others on the Cardano blockchain.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You can use tokens for many fun things:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">Create your own digital currency</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Make collectible items for games</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Create tickets for special events</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Make badges for achievements</Typography>
                    </li>
                  </ul>
                </>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          {advanced ? 'Create New Token' : 'Make Your Own Token'}
        </Button>
      </Box>
      
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                border: `2px solid ${theme.palette[ageGroup].main}`,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {advanced ? 'Token Details' : 'Design Your Token'}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Token Name"
                    variant="outlined"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    required
                    helperText={advanced ? "The full name of your token" : "What's your token called?"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Token Symbol"
                    variant="outlined"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.slice(0, 5))}
                    required
                    inputProps={{ maxLength: 5 }}
                    helperText={advanced ? "Short symbol (max 5 characters)" : "Short code for your token (like BTC)"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    multiline
                    rows={2}
                    helperText={advanced ? "What is the purpose of this token?" : "What's special about your token?"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    {advanced ? `Quantity: ${tokenQuantity.toLocaleString()}` : `How many tokens? ${tokenQuantity}`}
                  </Typography>
                  <Slider
                    value={tokenQuantity}
                    onChange={(_, newValue) => setTokenQuantity(newValue as number)}
                    min={1}
                    max={advanced ? 1000000 : 1000}
                    step={advanced ? 1000 : 10}
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Token Icon</InputLabel>
                    <Select
                      value={tokenIcon}
                      label="Token Icon"
                      onChange={(e: SelectChangeEvent) => setTokenIcon(e.target.value)}
                    >
                      {tokenIcons.map((icon, index) => (
                        <MenuItem key={index} value={icon}>
                          <Box sx={{ fontSize: '1.5rem' }}>{icon}</Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Token Color</InputLabel>
                    <Select
                      value={tokenColor}
                      label="Token Color"
                      onChange={(e: SelectChangeEvent) => setTokenColor(e.target.value)}
                    >
                      {tokenColors.map((color, index) => (
                        <MenuItem key={index} value={color}>
                          <Box sx={{ 
                            width: 20, 
                            height: 20, 
                            backgroundColor: color, 
                            borderRadius: '50%',
                            mr: 1
                          }} />
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {advanced && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">Metadata Fields (Optional)</Typography>
                      <Button
                        size="small"
                        startIcon={<AddCircleIcon />}
                        onClick={addMetadataField}
                      >
                        Add Field
                      </Button>
                    </Box>
                    
                    {metadataFields.map((field, index) => (
                      <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                        <TextField
                          label="Key"
                          variant="outlined"
                          size="small"
                          value={field.key}
                          onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                          sx={{ mr: 1, flex: 1 }}
                        />
                        <TextField
                          label="Value"
                          variant="outlined"
                          size="small"
                          value={field.value}
                          onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                          sx={{ mr: 1, flex: 2 }}
                        />
                        <IconButton 
                          color="error" 
                          onClick={() => removeMetadataField(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Grid>
                )}
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={createToken}
                    disabled={!tokenName || !tokenSymbol}
                    startIcon={<SaveIcon />}
                  >
                    {advanced ? 'Create Token' : 'Make My Token!'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Token Collection */}
      {tokens.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {advanced ? 'Your Token Collection' : 'Your Amazing Tokens'}
          </Typography>
          
          <Grid container spacing={3}>
            {tokens.map((token) => (
              <Grid item xs={12} sm={6} md={4} key={token.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'visible',
                      position: 'relative',
                      boxShadow: 3
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: -15, 
                        right: -15, 
                        zIndex: 1 
                      }}
                    >
                      <IconButton 
                        color="error" 
                        onClick={() => deleteToken(token.id)}
                        sx={{ 
                          backgroundColor: 'white',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#ffeeee'
                          }
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <CardMedia
                      sx={{ 
                        height: 140, 
                        backgroundColor: token.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem'
                      }}
                    >
                      {token.icon}
                    </CardMedia>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                          {token.name}
                        </Typography>
                        <Chip 
                          label={token.symbol} 
                          size="small" 
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      
                      {token.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {token.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TokenIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {token.quantity.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {advanced && Object.keys(token.metadata).length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Metadata:
                          </Typography>
                          {Object.entries(token.metadata).map(([key, value], index) => (
                            <Typography key={index} variant="caption" display="block" sx={{ ml: 1 }}>
                              <b>{key}:</b> {value}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          {tokens.length >= 2 && (
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
              <Typography variant="body1" paragraph>
                {advanced 
                  ? "On Cardano, you can create these tokens natively without smart contracts. This makes them more efficient and secure than tokens on other blockchains."
                  : "Great job creating tokens! In the real Cardano blockchain, people can create and share tokens just like these."}
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TokenCreator;
