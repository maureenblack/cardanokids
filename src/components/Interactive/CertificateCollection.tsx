import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Divider,
  useTheme,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Certificate interface
interface Certificate {
  id: string;
  title: string;
  moduleId: string;
  awardedDate: Date;
  score: number;
  image: string;
}

/**
 * CertificateCollection Component
 * 
 * Displays all the NFT certificates a child has earned by completing quizzes.
 */
const CertificateCollection: React.FC = () => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [open, setOpen] = useState(false);
  
  // Load certificates from local storage
  useEffect(() => {
    const savedCertificates = JSON.parse(localStorage.getItem('cardanoKidsCertificates') || '[]');
    
    // Convert date strings to Date objects
    const formattedCertificates = savedCertificates.map((cert: any) => ({
      ...cert,
      awardedDate: new Date(cert.awardedDate)
    }));
    
    setCertificates(formattedCertificates);
  }, []);
  
  // Handle opening certificate dialog
  const handleOpenCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setOpen(true);
  };
  
  // Handle closing certificate dialog
  const handleClose = () => {
    setOpen(false);
  };
  
  // Handle sharing certificate
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert('Sharing functionality would be implemented here!');
  };
  
  // Render certificate dialog
  const renderCertificateDialog = () => {
    if (!selectedCertificate) return null;
    
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
            NFT Certificate
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={selectedCertificate.image}
              alt="Certificate"
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                boxShadow: 3
              }}
            />
            
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Certificate of Achievement
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
                This certifies that
              </Typography>
              
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 4, 
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Cardano Kid
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                has successfully completed the
              </Typography>
              
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 4,
                textAlign: 'center'
              }}>
                {selectedCertificate.title}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                with a score of
              </Typography>
              
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette[ageGroup].main,
                mb: 4,
                textAlign: 'center'
              }}>
                {selectedCertificate.score}%
              </Typography>
              
              <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                Awarded on {selectedCertificate.awardedDate.toLocaleDateString()}
              </Typography>
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: 20, 
                right: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  NFT ID: {selectedCertificate.id}
                </Typography>
                <Typography variant="caption">
                  Stored on Cardano Blockchain
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Certificate Details:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Title:</strong> {selectedCertificate.title}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Module ID:</strong> {selectedCertificate.moduleId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Date Awarded:</strong> {selectedCertificate.awardedDate.toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Score:</strong> {selectedCertificate.score}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              About NFT Certificates:
            </Typography>
            <Typography variant="body2" paragraph>
              This certificate is represented as a Non-Fungible Token (NFT) on the Cardano blockchain. 
              NFTs are unique digital assets that cannot be replaced with something else, making them 
              perfect for certificates and collectibles.
            </Typography>
            <Typography variant="body2">
              Your achievement is permanently recorded on the blockchain, providing a verifiable 
              proof of your learning accomplishment that can't be altered or deleted.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleShare}
            startIcon={<CardGiftcardIcon />}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SchoolIcon sx={{ fontSize: 40, mr: 2, color: theme.palette[ageGroup].main }} />
        <Typography variant="h4" component="h1">
          My NFT Certificates
        </Typography>
      </Box>
      
      {certificates.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Certificates Yet
          </Typography>
          <Typography variant="body1" paragraph>
            Complete quizzes with a passing score to earn your first NFT certificate!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            href="/learning/building-blocks"
          >
            Start Learning
          </Button>
        </Paper>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 4 }}>
            You have earned {certificates.length} NFT {certificates.length === 1 ? 'certificate' : 'certificates'}. 
            Each certificate is stored on the Cardano blockchain as a unique NFT.
          </Alert>
          
          <Grid container spacing={3}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 3
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={certificate.image}
                        alt={certificate.title}
                        sx={{ filter: 'brightness(0.7)' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          padding: '10px',
                        }}
                      >
                        <Typography variant="h6" component="div" noWrap>
                          {certificate.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${certificate.score}%`}
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Awarded on {certificate.awardedDate.toLocaleDateString()}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="caption" display="block">
                        NFT ID: {certificate.id.substring(0, 8)}...
                      </Typography>
                      
                      <Typography variant="caption" display="block">
                        Module: {certificate.moduleId}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        fullWidth
                        variant="contained"
                        onClick={() => handleOpenCertificate(certificate)}
                        startIcon={<CardGiftcardIcon />}
                      >
                        View Certificate
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {renderCertificateDialog()}
    </Box>
  );
};

export default CertificateCollection;
