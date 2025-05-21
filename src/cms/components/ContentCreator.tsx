/**
 * Content Creator Component
 * 
 * This component provides a form for educators to create and edit educational content
 * for the Cardano Kids platform.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Grid,
  Paper,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import { 
  ContentType, 
  ContentLevel, 
  AccessRequirement,
  ContentMetadata
} from '../models';
import { contentService } from '../services/contentService';
import { ipfsService } from '../services/ipfsService';
import { useAuth } from '../../auth/AuthContext';
import { AgeGroup } from '../../auth/types';

/**
 * Content Creator Component
 */
const ContentCreator: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.LESSON);
  const [contentLevel, setContentLevel] = useState<ContentLevel>(ContentLevel.BEGINNER);
  const [targetAgeGroups, setTargetAgeGroups] = useState<AgeGroup[]>([]);
  const [contentUrl, setContentUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [moduleId, setModuleId] = useState<string>('');
  const [contentOrder, setContentOrder] = useState<number>(0);
  const [accessRequirements, setAccessRequirements] = useState<AccessRequirement[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [cardanoTopics, setCardanoTopics] = useState<string[]>([]);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  
  // Form validation
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [contentUrlError, setContentUrlError] = useState<string | null>(null);
  const [ageGroupsError, setAgeGroupsError] = useState<string | null>(null);
  
  // Load modules on component mount
  useEffect(() => {
    // In a real implementation, fetch modules from API
    setModules([
      { id: 'module1', name: 'What is a Blockchain?' },
      { id: 'module2', name: 'Blockchains Are Like Building Blocks' },
      { id: 'module3', name: 'Welcome to Cardano Land' },
      { id: 'module4', name: 'Digital Treasures' },
      { id: 'module5', name: 'How Blockchains Work' },
      { id: 'module6', name: 'Exploring Cardano' }
    ]);
  }, []);
  
  // Handle form field changes
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value.trim() === '') {
      setTitleError('Title is required');
    } else {
      setTitleError(null);
    }
  };
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
    if (event.target.value.trim() === '') {
      setDescriptionError('Description is required');
    } else {
      setDescriptionError(null);
    }
  };
  
  const handleContentTypeChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value as ContentType);
  };
  
  const handleContentLevelChange = (event: SelectChangeEvent) => {
    setContentLevel(event.target.value as ContentLevel);
  };
  
  const handleTargetAgeGroupsChange = (event: SelectChangeEvent<AgeGroup[]>) => {
    const value = event.target.value as AgeGroup[];
    setTargetAgeGroups(value);
    if (value.length === 0) {
      setAgeGroupsError('At least one age group is required');
    } else {
      setAgeGroupsError(null);
    }
  };
  
  const handleContentUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentUrl(event.target.value);
    if (event.target.value.trim() === '') {
      setContentUrlError('Content URL is required');
    } else {
      setContentUrlError(null);
    }
  };
  
  const handleThumbnailUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(event.target.value);
  };
  
  const handleModuleIdChange = (event: SelectChangeEvent) => {
    setModuleId(event.target.value);
  };
  
  const handleContentOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentOrder(parseInt(event.target.value) || 0);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    if (title.trim() === '') {
      setTitleError('Title is required');
      isValid = false;
    }
    
    if (description.trim() === '') {
      setDescriptionError('Description is required');
      isValid = false;
    }
    
    if (contentUrl.trim() === '') {
      setContentUrlError('Content URL is required');
      isValid = false;
    }
    
    if (targetAgeGroups.length === 0) {
      setAgeGroupsError('At least one age group is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContentType(ContentType.LESSON);
    setContentLevel(ContentLevel.BEGINNER);
    setTargetAgeGroups([]);
    setContentUrl('');
    setThumbnailUrl('');
    setModuleId('');
    setContentOrder(0);
    setAccessRequirements([]);
    
    // Reset validation errors
    setTitleError(null);
    setDescriptionError(null);
    setContentUrlError(null);
    setAgeGroupsError(null);
    
    // Reset status messages
    setError(null);
    setSuccess(null);
  };
  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Prepare content metadata
      const metadata: ContentMetadata = {
        id: '', // Will be set by the service
        title,
        description,
        type: contentType,
        level: contentLevel,
        targetAgeGroups,
        createdAt: new Date(),
        updatedAt: new Date(),
        keywords,
        learningObjectives,
        estimatedDuration: duration,
        cardanoTopics
      };
      
      // Create content
      await contentService.createContent(
        metadata,
        contentUrl,
        thumbnailUrl,
        accessRequirements,
        moduleId,
        contentOrder,
        currentUser?.id || ''
      );
      
      setSuccess('Content created successfully! It will be reviewed by Cardano experts before publishing.');
      resetForm();
      setLoading(false);
    } catch (err) {
      setError('Failed to create content. Please try again later.');
      setLoading(false);
    }
  };
  
  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Create Educational Content</Typography>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}
      
      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3} component="div">
          {/* Basic Information */}
          <Grid item xs={12} component="div">
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
          </Grid>
          
          <Grid item xs={12} component="div">
            <TextField
              label="Title"
              value={title}
              onChange={handleTitleChange}
              fullWidth
              required
              error={!!titleError}
              helperText={titleError}
            />
          </Grid>
          
          <Grid item xs={12} component="div">
            <TextField
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              required
              multiline
              rows={4}
              error={!!descriptionError}
              helperText={descriptionError}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} component="div">
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentType}
                label="Content Type"
                onChange={handleContentTypeChange}
              >
                <MenuItem value={ContentType.LESSON}>Lesson</MenuItem>
                <MenuItem value={ContentType.VIDEO}>Video</MenuItem>
                <MenuItem value={ContentType.QUIZ}>Quiz</MenuItem>
                <MenuItem value={ContentType.SIMULATION}>Simulation</MenuItem>
                <MenuItem value={ContentType.GAME}>Game</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} component="div">
            <FormControl fullWidth>
              <InputLabel>Content Level</InputLabel>
              <Select
                value={contentLevel}
                label="Content Level"
                onChange={handleContentLevelChange}
              >
                <MenuItem value={ContentLevel.BEGINNER}>Beginner</MenuItem>
                <MenuItem value={ContentLevel.INTERMEDIATE}>Intermediate</MenuItem>
                <MenuItem value={ContentLevel.ADVANCED}>Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} component="div">
            <FormControl fullWidth error={!!ageGroupsError}>
              <InputLabel>Target Age Groups</InputLabel>
              <Select
                multiple
                value={targetAgeGroups}
                onChange={handleTargetAgeGroupsChange}
                input={<OutlinedInput label="Target Age Groups" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value={AgeGroup.YOUNG}>Young (6-8)</MenuItem>
                <MenuItem value={AgeGroup.MIDDLE}>Middle (9-11)</MenuItem>
                <MenuItem value={AgeGroup.OLDER}>Older (12-14)</MenuItem>
              </Select>
              {ageGroupsError && <FormHelperText>{ageGroupsError}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Content URLs */}
          <Grid item xs={12} component="div">
            <Typography variant="h6" gutterBottom>Content URLs</Typography>
          </Grid>
          
          <Grid item xs={12} component="div">
            <TextField
              label="Content URL"
              value={contentUrl}
              onChange={handleContentUrlChange}
              fullWidth
              required
              placeholder="https://example.com/content"
              error={!!contentUrlError}
              helperText={contentUrlError}
            />
          </Grid>
          
          <Grid item xs={12} component="div">
            <TextField
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={handleThumbnailUrlChange}
              fullWidth
              placeholder="https://example.com/thumbnail.jpg"
            />
          </Grid>
          
          {/* Module Information */}
          <Grid item xs={12} component="div">
            <Typography variant="h6" gutterBottom>Module Information</Typography>
          </Grid>
          
          <Grid item xs={12} sm={8} component="div">
            <FormControl fullWidth>
              <InputLabel>Module</InputLabel>
              <Select
                value={moduleId}
                label="Module"
                onChange={handleModuleIdChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} component="div">
            <TextField
              label="Content Order"
              type="number"
              value={contentOrder}
              onChange={handleContentOrderChange}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12} component="div">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={resetForm}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Content'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ContentCreator;
