import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChildUser, PicturePassword, AgeGroup } from '../types';
import { useAuth } from '../AuthContext';
import PicturePasswordInput from './PicturePasswordInput';
import ParentalConsentForm from './ParentalConsentForm';

interface CreateChildAccountProps {
  onComplete?: (childAccount: ChildUser) => void;
  onCancel?: () => void;
}

const CreateChildAccount: React.FC<CreateChildAccountProps> = ({
  onComplete,
  onCancel
}) => {
  const theme = useTheme();
  const { createChildAccount, currentUser, isLoading, error, clearError } = useAuth();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Child account data
  const [childData, setChildData] = useState<Partial<ChildUser>>({
    displayName: '',
    username: '',
    ageGroup: 'young',
    isActive: true
  });
  
  // Picture password
  const [picturePassword, setPicturePassword] = useState<PicturePassword | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Steps in the creation process
  const steps = ['Basic Information', 'Picture Password', 'Parental Consent'];
  
  // Handle basic information submission
  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!childData.displayName?.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!childData.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (childData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // If there are errors, display them and don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and proceed to next step
    setErrors({});
    setActiveStep(1);
  };
  
  // Handle picture password submission
  const handlePicturePasswordSubmit = (password: PicturePassword) => {
    setPicturePassword(password);
    setActiveStep(2);
  };
  
  // Handle parental consent submission
  const handleConsentComplete = async (consentRecord: any) => {
    try {
      if (!currentUser || !childData.username || !childData.displayName || !childData.ageGroup) {
        throw new Error('Missing required data for child account creation');
      }
      
      // Create child account with all collected data
      const newChildAccount = await createChildAccount({
        ...childData,
        picturePassword: picturePassword || undefined,
        // Add additional fields from consent if needed
      });
      
      if (onComplete) {
        onComplete(newChildAccount);
      }
    } catch (err) {
      console.error('Failed to create child account:', err);
      setErrors({ submit: 'Failed to create child account. Please try again.' });
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else if (onCancel) {
      onCancel();
    }
  };
  
  // Handle age group selection
  const handleAgeGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChildData({
      ...childData,
      ageGroup: event.target.value as AgeGroup
    });
  };
  
  // Render the current step
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleBasicInfoSubmit}>
            <Typography variant="h6" gutterBottom>
              Child's Information
            </Typography>
            
            <TextField
              label="Display Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={childData.displayName || ''}
              onChange={(e) => setChildData({ ...childData, displayName: e.target.value })}
              error={!!errors.displayName}
              helperText={errors.displayName || 'This is the name that will be shown in the app'}
              required
            />
            
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={childData.username || ''}
              onChange={(e) => setChildData({ ...childData, username: e.target.value })}
              error={!!errors.username}
              helperText={errors.username || 'This will be used to log in'}
              required
            />
            
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <FormLabel component="legend">Age Group</FormLabel>
              <RadioGroup
                row
                name="ageGroup"
                value={childData.ageGroup}
                onChange={handleAgeGroupChange}
              >
                <FormControlLabel 
                  value="young" 
                  control={<Radio />} 
                  label="Ages 6-8" 
                />
                <FormControlLabel 
                  value="middle" 
                  control={<Radio />} 
                  label="Ages 9-11" 
                />
                <FormControlLabel 
                  value="older" 
                  control={<Radio />} 
                  label="Ages 12-14" 
                />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
              </Button>
            </Box>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Create a Picture Password
            </Typography>
            
            <Typography variant="body2" paragraph>
              A picture password is a fun and secure way for your child to log in. They'll select a sequence of pictures that they can easily remember.
            </Typography>
            
            <PicturePasswordInput
              onComplete={handlePicturePasswordSubmit}
              isCreating={true}
              maxSelections={4}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
            </Box>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            {currentUser && childData.displayName && (
              <ParentalConsentForm
                childId="temp-id" // Will be assigned by the server
                parentId={currentUser.id}
                childName={childData.displayName}
                childAge={childData.ageGroup === 'young' ? 7 : childData.ageGroup === 'middle' ? 10 : 13}
                onConsentComplete={handleConsentComplete}
                onCancel={handleBack}
              />
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 4 }}
        >
          Create Child Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}
        
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStep()}
      </Paper>
    </motion.div>
  );
};

export default CreateChildAccount;
