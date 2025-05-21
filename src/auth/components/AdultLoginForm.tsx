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
import { AdultLoginCredentials } from '../types';
import { useAuth } from '../AuthContext';

interface AdultLoginFormProps {
  onLoginSuccess?: () => void;
  onSwitchToChildLogin?: () => void;
  onForgotPassword?: () => void;
}

const AdultLoginForm: React.FC<AdultLoginFormProps> = ({
  onLoginSuccess,
  onSwitchToChildLogin,
  onForgotPassword
}) => {
  const theme = useTheme();
  const { loginAdult, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const credentials: AdultLoginCredentials = { email, password };
      await loginAdult(credentials);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login failed:', err);
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
          maxWidth: 500, 
          mx: 'auto',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          Parent/Teacher Login
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
          Log in to manage your child's learning journey
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={isLoading}
            required
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={isLoading}
            required
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onForgotPassword}
              sx={{ color: theme.palette.primary.main }}
            >
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ 
              py: 1.5, 
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
        </form>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you a child looking to log in?
          </Typography>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={onSwitchToChildLogin}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Go to Kid's Login
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link href="/signup" sx={{ color: theme.palette.primary.main }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AdultLoginForm;
