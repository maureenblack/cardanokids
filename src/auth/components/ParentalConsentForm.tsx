import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { ConsentRecord, ConsentStatus } from '../types';
import { authService } from '../authService';

interface ParentalConsentFormProps {
  childId: string;
  parentId: string;
  childName: string;
  childAge: number;
  onConsentComplete: (consentRecord: ConsentRecord) => void;
  onCancel: () => void;
}

const ParentalConsentForm: React.FC<ParentalConsentFormProps> = ({
  childId,
  parentId,
  childName,
  childAge,
  onConsentComplete,
  onCancel
}) => {
  const theme = useTheme();
  
  // State for consent checkboxes
  const [dataCollection, setDataCollection] = useState<boolean>(false);
  const [accountCreation, setAccountCreation] = useState<boolean>(false);
  const [contentAccess, setContentAccess] = useState<boolean>(false);
  const [ageVerification, setAgeVerification] = useState<boolean>(false);
  const [termsAgreement, setTermsAgreement] = useState<boolean>(false);
  
  // State for parent information
  const [parentName, setParentName] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [parentRelationship, setParentRelationship] = useState<string>('');
  
  // State for form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Check if all required consents are given
  const allConsentsGiven = dataCollection && accountCreation && contentAccess && ageVerification && termsAgreement;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    }
    
    if (!parentEmail.trim()) {
      newErrors.parentEmail = 'Parent email is required';
    } else if (!/\S+@\S+\.\S+/.test(parentEmail)) {
      newErrors.parentEmail = 'Email is invalid';
    }
    
    if (!parentRelationship.trim()) {
      newErrors.parentRelationship = 'Relationship to child is required';
    }
    
    if (!allConsentsGiven) {
      newErrors.consents = 'All consent items must be acknowledged';
    }
    
    // If there are errors, display them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Prepare consent data
      const consentData: Partial<ConsentRecord> = {
        childId,
        parentId,
        status: ConsentStatus.GRANTED,
        consentVersion: '1.0',
        dataCollectionPurposes: [
          'account_management',
          'educational_content',
          'progress_tracking',
          'achievements'
        ]
      };
      
      // Record consent
      const consentRecord = await authService.recordConsent(parentId, childId, consentData);
      
      // Call the completion handler
      onConsentComplete(consentRecord);
    } catch (error) {
      console.error('Failed to record consent:', error);
      setErrors({ submit: 'Failed to record consent. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: theme.palette.primary.main }}>
          Parental Consent
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 3 }}>
          For {childName}'s participation in Cardano Kids (ages 6-14)
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Parent/Guardian Information
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              error={!!errors.parentName}
              helperText={errors.parentName}
              required
            />
            
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              error={!!errors.parentEmail}
              helperText={errors.parentEmail}
              required
            />
            
            <TextField
              label="Relationship to Child"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="e.g., Parent, Legal Guardian, Teacher"
              value={parentRelationship}
              onChange={(e) => setParentRelationship(e.target.value)}
              error={!!errors.parentRelationship}
              helperText={errors.parentRelationship}
              required
            />
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Consent Items
          </Typography>
          
          {errors.consents && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.consents}
            </Alert>
          )}
          
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dataCollection}
                  onChange={(e) => setDataCollection(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I consent to the collection and processing of my child's personal information for the purpose of providing educational services.
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={accountCreation}
                  onChange={(e) => setAccountCreation(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I authorize the creation of an account for my child on the Cardano Kids platform.
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={contentAccess}
                  onChange={(e) => setContentAccess(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I consent to my child accessing age-appropriate educational content about blockchain technology.
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={ageVerification}
                  onChange={(e) => setAgeVerification(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I confirm that my child is between 6-14 years old and that I have the legal authority to provide consent on their behalf.
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAgreement}
                  onChange={(e) => setTermsAgreement(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I have read and agree to the Terms of Service and Privacy Policy for Cardano Kids.
                </Typography>
              }
            />
          </Box>
          
          <Accordion sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Privacy Policy Summary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Data Collection:</strong> We collect minimal personal information necessary to provide educational services, including name, age, learning progress, and achievements.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Data Usage:</strong> Information is used to personalize learning experiences, track educational progress, and issue achievement credentials.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Data Protection:</strong> We implement age-appropriate security measures, including simplified authentication for children and separation from real blockchain assets.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Parental Rights:</strong> Parents can review, update, or delete their child's information at any time through the parent dashboard.
              </Typography>
              <Typography variant="body2">
                <strong>Third Parties:</strong> We do not share children's personal information with third parties except as required to provide the educational service or as required by law.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Wallet Separation & Safety</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Child Account Safety:</strong> Child accounts do not have direct access to real Cardano wallets or cryptocurrency. All blockchain interactions are educational simulations.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Parent Wallet Connection:</strong> Only parent/teacher accounts can connect to real Cardano wallets, and this connection is optional and used only for educational demonstrations.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Achievement Tokens:</strong> Children earn achievement tokens within the platform that have no real monetary value. These can be converted to on-chain NFTs only with explicit parent approval.
              </Typography>
              <Typography variant="body2">
                <strong>Financial Protection:</strong> The platform is designed to prevent children from making any real financial transactions or accessing cryptocurrency.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!allConsentsGiven || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Provide Consent'}
            </Button>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default ParentalConsentForm;
