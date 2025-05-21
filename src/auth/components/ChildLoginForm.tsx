import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Link,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChildLoginCredentials, PicturePassword } from '../types';
import { useAuth } from '../AuthContext';
import { useAgeGroup } from '../../context/AgeGroupContext';
import PicturePasswordInput from './PicturePasswordInput';

interface ChildLoginFormProps {
  onLoginSuccess?: () => void;
  onSwitchToAdultLogin?: () => void;
  onNeedHelp?: () => void;
}

const ChildLoginForm: React.FC<ChildLoginFormProps> = ({
  onLoginSuccess,
  onSwitchToAdultLogin,
  onNeedHelp
}) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const { loginChild, isLoading, error, clearError } = useAuth();
  
  const [username, setUsername] = useState<string>('');
  const [picturePassword, setPicturePassword] = useState<PicturePassword | null>(null);
  const [showPicturePassword, setShowPicturePassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ username?: string }>({});
  
  const validateUsername = (): boolean => {
    if (!username.trim()) {
      setFormErrors({ username: 'Please enter your username' });
      return false;
    }
    
    setFormErrors({});
    return true;
  };
  
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (validateUsername()) {
      setShowPicturePassword(true);
    }
  };
  
  const handlePicturePasswordComplete = async (password: PicturePassword) => {
    try {
      const credentials: ChildLoginCredentials = {
        username,
        picturePassword: {
          sequence: password.sequence.map(item => `${item.categoryId}:${item.imageId}`)
        }
      };
      
      await loginChild(credentials);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login failed:', err);
    }
  };
  
  const handleBackToUsername = () => {
    setShowPicturePassword(false);
    clearError();
  };
  
  // Get age-appropriate instructions
  const getUsernameInstructions = () => {
    switch (ageGroup) {
      case 'young':
        return "Enter your special username to start your adventure!";
      case 'middle':
        return "Enter your username to access your learning journey.";
      case 'older':
        return "Enter your username to log in to your account.";
      default:
        return "Enter your username to continue.";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          maxWidth: showPicturePassword ? 600 : 500, 
          mx: 'auto',
          backgroundColor: theme.palette.background.paper
        }}
      >
        {!showPicturePassword ? (
          // Username input screen
          <>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                color: theme.palette[ageGroup].main,
                fontWeight: 'bold'
              }}
            >
              Kid's Login
            </Typography>
            
            <Typography variant="body1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
              {getUsernameInstructions()}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message}
              </Alert>
            )}
            
            <form onSubmit={handleUsernameSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!formErrors.username}
                helperText={formErrors.username}
                disabled={isLoading}
                required
                InputProps={{
                  sx: { 
                    borderRadius: 2,
                    fontSize: '1.2rem'
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem'
                  }
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  mt: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: theme.palette[ageGroup].main,
                  '&:hover': {
                    backgroundColor: theme.palette[ageGroup].dark
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={onNeedHelp}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  Need help logging in?
                </Link>
              </Box>
            </form>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Are you a parent or teacher?
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={onSwitchToAdultLogin}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Go to Parent/Teacher Login
              </Button>
            </Box>
          </>
        ) : (
          // Picture password screen
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                variant="text"
                color="primary"
                onClick={handleBackToUsername}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Hi, {username}!
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message}
              </Alert>
            )}
            
            <PicturePasswordInput
              onComplete={handlePicturePasswordComplete}
              isCreating={false}
              maxSelections={4}
            />
          </>
        )}
      </Paper>
    </motion.div>
  );
};

export default ChildLoginForm;
