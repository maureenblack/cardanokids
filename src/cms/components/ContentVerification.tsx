/**
 * Content Verification Component
 * 
 * This component allows Cardano experts to verify educational content
 * for accuracy before it's published to the blockchain.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  TextField,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import { EducationalContent, VerificationStatus } from '../models';
import { contentService } from '../services/contentService';
import { useAuth } from '../../auth/AuthContext';

/**
 * Content Verification Component
 */
const ContentVerification: React.FC = () => {
  const { currentUser } = useAuth();
  const [pendingContents, setPendingContents] = useState<EducationalContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [verificationNote, setVerificationNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  
  // Load pending content on component mount
  useEffect(() => {
    const fetchPendingContents = async () => {
      try {
        setLoading(true);
        const contents = await contentService.getAllContent({
          verificationStatus: VerificationStatus.PENDING
        });
        setPendingContents(contents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPendingContents();
  }, []);
  
  // Handle content selection
  const handleContentSelect = (content: EducationalContent) => {
    setSelectedContent(content);
    setVerificationNote('');
  };
  
  // Handle verification note change
  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationNote(event.target.value);
  };
  
  // Open confirmation dialog
  const openDialog = (action: 'approve' | 'reject') => {
    setDialogAction(action);
    setDialogOpen(true);
  };
  
  // Close confirmation dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };
  
  // Handle content verification
  const handleVerify = async () => {
    if (!selectedContent) return;
    
    try {
      setLoading(true);
      
      // Verify or reject the content
      if (dialogAction === 'approve') {
        await contentService.verifyContent(
          selectedContent.id,
          currentUser?.id || '',
          Boolean(verificationNote)
        );
      } else {
        // Use the verifyContent method with approved=false
        await contentService.verifyContent(
          selectedContent.id,
          currentUser?.id || '',
          false,
          verificationNote || ''
        );
      }
      
      // Update the pending contents list
      const updatedContents = pendingContents.filter(
        content => content.id !== selectedContent.id
      );
      setPendingContents(updatedContents);
      
      // Reset selected content
      setSelectedContent(null);
      setVerificationNote('');
      
      closeDialog();
      setLoading(false);
    } catch (err) {
      setError(`Failed to ${dialogAction} content. Please try again later.`);
      closeDialog();
      setLoading(false);
    }
  };
  
  if (loading && pendingContents.length === 0) {
    return <Typography>Loading pending content...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Content Verification</Typography>
      
      {pendingContents.length === 0 && !selectedContent ? (
        <Typography>No content pending verification.</Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Pending Content List */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Pending Verification
              <Chip 
                label={pendingContents.length} 
                color="warning" 
                size="small" 
                sx={{ ml: 1 }} 
              />
            </Typography>
            
            <List sx={{ bgcolor: 'background.paper' }}>
              {pendingContents.map((content) => (
                <ListItem
                  key={content.id}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: selectedContent?.id === content.id ? 'action.selected' : 'inherit'
                  }}
                  onClick={() => handleContentSelect(content)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PendingIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={content.metadata.title}
                    secondary={`${content.metadata.type} • ${content.metadata.level}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Content Preview and Verification */}
          <Grid item xs={12} md={8} component="div">
            {selectedContent ? (
              <Card>
                <CardContent>
                  <Typography variant="h6">{selectedContent.metadata.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedContent.metadata.type} • {selectedContent.metadata.level}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" paragraph>
                    {selectedContent.metadata.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Target Age Groups:</Typography>
                    {selectedContent.metadata.targetAgeGroups.map((ageGroup) => (
                      <Chip 
                        key={ageGroup} 
                        label={ageGroup} 
                        size="small" 
                        sx={{ mr: 0.5 }} 
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Content URL:</Typography>
                    <Typography variant="body2" component="a" href={selectedContent.contentUrl} target="_blank">
                      {selectedContent.contentUrl}
                    </Typography>
                  </Box>
                  
                  <TextField
                    label="Verification Notes"
                    multiline
                    rows={4}
                    value={verificationNote}
                    onChange={handleNoteChange}
                    fullWidth
                    margin="normal"
                    placeholder="Enter your verification notes here. For rejections, please provide detailed feedback on what needs to be corrected."
                  />
                </CardContent>
                
                <CardActions>
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => openDialog('approve')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<CancelIcon />}
                    onClick={() => openDialog('reject')}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <Typography>Select content from the list to verify.</Typography>
            )}
          </Grid>
        </Grid>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {dialogAction === 'approve' ? 'Approve Content' : 'Reject Content'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'approve' 
              ? 'Are you sure you want to approve this content? This confirms that the educational content is accurate and suitable for the Cardano Kids platform.'
              : 'Are you sure you want to reject this content? The content creator will be notified of your feedback.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button 
            onClick={handleVerify} 
            color={dialogAction === 'approve' ? 'success' : 'error'}
            autoFocus
          >
            {dialogAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentVerification;
