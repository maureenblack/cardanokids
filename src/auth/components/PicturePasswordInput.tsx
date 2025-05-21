import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Tabs, 
  Tab,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { PicturePassword } from '../types';
import { authService } from '../authService';
import { useAgeGroup } from '../../context/AgeGroupContext';

interface PictureCategory {
  id: string;
  name: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

interface PicturePasswordInputProps {
  onComplete: (password: PicturePassword) => void;
  isCreating?: boolean;
  existingPassword?: PicturePassword;
  maxSelections?: number;
}

const PicturePasswordInput: React.FC<PicturePasswordInputProps> = ({
  onComplete,
  isCreating = false,
  existingPassword,
  maxSelections = 4
}) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  
  const [categories, setCategories] = useState<PictureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<Array<{ categoryId: string; imageId: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmMode, setConfirmMode] = useState<boolean>(false);
  const [passwordHint, setPasswordHint] = useState<string>('');
  
  // Load picture categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const picCategories = await authService.getPictureCategories();
        setCategories(picCategories);
        
        // Set the first category as selected
        if (picCategories.length > 0) {
          setSelectedCategory(picCategories[0].id);
        }
      } catch (err) {
        setError('Failed to load picture categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Handle category tab change
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };
  
  // Handle image selection
  const handleImageSelect = (categoryId: string, imageId: string) => {
    // If we already have max selections, remove the oldest one
    if (selectedImages.length >= maxSelections) {
      setSelectedImages(prev => [...prev.slice(1), { categoryId, imageId }]);
    } else {
      setSelectedImages(prev => [...prev, { categoryId, imageId }]);
    }
  };
  
  // Handle clear selections
  const handleClear = () => {
    setSelectedImages([]);
    setConfirmMode(false);
  };
  
  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedImages.length < 3) {
      setError('Please select at least 3 pictures for your password');
      return;
    }
    
    if (isCreating) {
      // If creating a new password, go to confirm mode
      if (!confirmMode) {
        setConfirmMode(true);
        return;
      }
    }
    
    // Complete the password creation/entry
    onComplete({
      sequence: selectedImages,
      hint: passwordHint
    });
  };
  
  // Get image details by ID
  const getImageDetails = (categoryId: string, imageId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    const image = category.images.find(img => img.id === imageId);
    return image || null;
  };
  
  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress color="primary" />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  // Get age-appropriate instructions
  const getInstructions = () => {
    if (isCreating) {
      if (confirmMode) {
        return "Great! Now enter the same picture sequence again to confirm your password.";
      }
      
      switch (ageGroup) {
        case 'young':
          return "Choose 3 or 4 pictures that you'll remember. This will be your secret picture password!";
        case 'middle':
          return "Select 3 or 4 pictures in a sequence you can remember. This sequence will be your password.";
        case 'older':
          return "Create a secure picture password by selecting 3-4 images in a specific sequence.";
        default:
          return "Select 3-4 pictures to create your password.";
      }
    } else {
      switch (ageGroup) {
        case 'young':
          return "Choose the pictures from your secret password in the right order!";
        case 'middle':
          return "Enter your picture password by selecting the images in the correct sequence.";
        case 'older':
          return "Enter your picture password sequence to log in.";
        default:
          return "Enter your picture password.";
      }
    }
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 3, 
            color: theme.palette[ageGroup].main,
            fontWeight: 'bold'
          }}
        >
          {isCreating ? "Create Your Picture Password" : "Enter Your Picture Password"}
        </Typography>
        
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          {getInstructions()}
        </Typography>
        
        {/* Selected images display */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.default
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Your selection ({selectedImages.length}/{maxSelections}):
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {selectedImages.map((selection, index) => {
              const image = getImageDetails(selection.categoryId, selection.imageId);
              return (
                <Box key={index}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: `2px solid ${theme.palette[ageGroup].main}`
                    }}
                  >
                    {image ? (
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: theme.palette.grey[300]
                        }}
                      >
                        <Typography variant="body2">{index + 1}</Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
            
            {/* Placeholder slots */}
            {Array.from({ length: maxSelections - selectedImages.length }).map((_, index) => (
              <Box key={`placeholder-${index}`}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {selectedImages.length + index + 1}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Paper>
        
        {/* Category tabs */}
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette[ageGroup].main,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette[ageGroup].main,
            }
          }}
        >
          {categories.map(category => (
            <Tab 
              key={category.id} 
              value={category.id} 
              label={category.name} 
              id={`category-tab-${category.id}`}
              aria-controls={`category-tabpanel-${category.id}`}
            />
          ))}
        </Tabs>
        
        {/* Image grid */}
        {categories.map(category => (
          <Box
            key={category.id}
            role="tabpanel"
            hidden={selectedCategory !== category.id}
            id={`category-tabpanel-${category.id}`}
            aria-labelledby={`category-tab-${category.id}`}
          >
            {selectedCategory === category.id && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {category.images.map(image => (
                  <Box sx={{ width: { xs: '25%', sm: '20%', md: '16%' } }} key={image.id}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          width: '100%',
                          paddingTop: '100%', // 1:1 aspect ratio
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: selectedImages.some(
                            sel => sel.categoryId === category.id && sel.imageId === image.id
                          )
                            ? `3px solid ${theme.palette[ageGroup].main}`
                            : 'none',
                          '&:hover': {
                            boxShadow: 4
                          }
                        }}
                        onClick={() => handleImageSelect(category.id, image.id)}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Paper>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
        
        {/* Password hint input (only when creating) */}
        {isCreating && !confirmMode && (
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Create a hint to help you remember your password (optional):
            </Typography>
            <input
              type="text"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value)}
              placeholder="Enter a hint..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.palette.grey[300]}`,
                fontSize: '16px'
              }}
              maxLength={50}
            />
          </Box>
        )}
        
        {/* Action buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            disabled={selectedImages.length === 0}
          >
            Clear
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={selectedImages.length < 3}
            sx={{
              backgroundColor: theme.palette[ageGroup].main,
              '&:hover': {
                backgroundColor: theme.palette[ageGroup].dark
              }
            }}
          >
            {isCreating 
              ? (confirmMode ? "Create Password" : "Next") 
              : "Login"
            }
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PicturePasswordInput;
