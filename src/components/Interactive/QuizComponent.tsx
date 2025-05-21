import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Question interface
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Quiz interface
interface QuizProps {
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  moduleId: string;
  onComplete?: (passed: boolean, score: number) => void;
}

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
 * QuizComponent
 * 
 * An interactive quiz component that tests children's knowledge of blockchain concepts
 * and awards them with NFT certificates upon successful completion.
 */
const QuizComponent: React.FC<QuizProps> = ({
  title,
  description,
  questions,
  passingScore = 70,
  moduleId,
  onComplete
}) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Calculate score when answers change
  useEffect(() => {
    if (showResults) {
      const correctAnswers = answers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(calculatedScore);
      
      // If passed, create certificate
      if (calculatedScore >= passingScore) {
        const newCertificate: Certificate = {
          id: `cert-${Date.now()}`,
          title: `${title} Certificate`,
          moduleId,
          awardedDate: new Date(),
          score: calculatedScore,
          image: getCertificateImage(ageGroup)
        };
        
        setCertificate(newCertificate);
        
        // Save certificate to local storage
        const savedCertificates = JSON.parse(localStorage.getItem('cardanoKidsCertificates') || '[]');
        savedCertificates.push(newCertificate);
        localStorage.setItem('cardanoKidsCertificates', JSON.stringify(savedCertificates));
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(calculatedScore >= passingScore, calculatedScore);
      }
    }
  }, [showResults, answers, questions, passingScore, moduleId, title, ageGroup, onComplete]);
  
  // Get certificate image based on age group
  const getCertificateImage = (ageGroup: string) => {
    const images = {
      young: 'https://img.freepik.com/free-vector/gradient-colorful-certificate-template_52683-65189.jpg',
      middle: 'https://img.freepik.com/free-vector/elegant-certificate-template-with-frame_23-2147776753.jpg',
      older: 'https://img.freepik.com/free-vector/professional-certificate-template-design_1017-33059.jpg'
    };
    
    return images[ageGroup as keyof typeof images] || images.young;
  };
  
  // Handle answer selection
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[activeStep] = parseInt(event.target.value, 10);
    setAnswers(newAnswers);
  };
  
  // Handle next question
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setShowExplanation(false);
  };
  
  // Handle previous question
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setShowExplanation(false);
  };
  
  // Handle quiz submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call to submit quiz results
    setTimeout(() => {
      setShowResults(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Handle retaking the quiz
  const handleRetake = () => {
    setActiveStep(0);
    setAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setCertificate(null);
  };
  
  // Handle showing certificate
  const handleShowCertificate = () => {
    setShowCertificate(true);
  };
  
  // Handle closing certificate dialog
  const handleCloseCertificate = () => {
    setShowCertificate(false);
  };
  
  // Render certificate
  const renderCertificate = () => {
    if (!certificate) return null;
    
    return (
      <Dialog
        open={showCertificate}
        onClose={handleCloseCertificate}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
            Achievement Unlocked: NFT Certificate
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={certificate.image}
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
                {title}
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
                {certificate.score}%
              </Typography>
              
              <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                Awarded on {certificate.awardedDate.toLocaleDateString()}
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
                  NFT ID: {certificate.id}
                </Typography>
                <Typography variant="caption">
                  Stored on Cardano Blockchain
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCertificate}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCloseCertificate}
          >
            Save to My Collection
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // If showing results
  if (showResults) {
    const passed = score >= passingScore;
    
    return (
      <Box sx={{ my: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            backgroundColor: passed 
              ? 'rgba(76, 175, 80, 0.1)' 
              : 'rgba(244, 67, 54, 0.1)',
            border: passed
              ? '1px solid rgba(76, 175, 80, 0.3)'
              : '1px solid rgba(244, 67, 54, 0.3)'
          }}
        >
          <Box sx={{ mb: 3 }}>
            {passed ? (
              <CheckCircleIcon 
                color="success" 
                sx={{ fontSize: 80 }}
              />
            ) : (
              <CancelIcon 
                color="error" 
                sx={{ fontSize: 80 }}
              />
            )}
          </Box>
          
          <Typography variant="h4" gutterBottom>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Your Score: {score}%
          </Typography>
          
          <Typography variant="body1" paragraph>
            {passed 
              ? 'You\'ve successfully completed the quiz and earned an NFT certificate!' 
              : `You need ${passingScore}% to pass. Don't worry, you can try again!`}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color={passed ? 'success' : 'primary'}
              onClick={handleRetake}
              sx={{ mr: 2 }}
            >
              {passed ? 'Take Again' : 'Try Again'}
            </Button>
            
            {passed && certificate && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowCertificate}
                startIcon={<CardGiftcardIcon />}
              >
                View NFT Certificate
              </Button>
            )}
          </Box>
          
          {renderCertificate()}
        </Paper>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Questions Review:
          </Typography>
          
          {questions.map((question, index) => (
            <Paper
              key={question.id}
              elevation={1}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 2,
                borderLeft: answers[index] === question.correctAnswer
                  ? '4px solid green'
                  : '4px solid red'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {question.question}
                  </Typography>
                  
                  {question.options.map((option, optIndex) => (
                    <Box 
                      key={optIndex}
                      sx={{ 
                        p: 1, 
                        pl: 2,
                        mb: 0.5,
                        borderRadius: 1,
                        backgroundColor: optIndex === question.correctAnswer
                          ? 'rgba(76, 175, 80, 0.1)'
                          : optIndex === answers[index] && optIndex !== question.correctAnswer
                            ? 'rgba(244, 67, 54, 0.1)'
                            : 'transparent',
                        border: optIndex === question.correctAnswer
                          ? '1px solid rgba(76, 175, 80, 0.3)'
                          : optIndex === answers[index] && optIndex !== question.correctAnswer
                            ? '1px solid rgba(244, 67, 54, 0.3)'
                            : '1px solid transparent'
                      }}
                    >
                      <Typography variant="body2">
                        {optIndex === question.correctAnswer && (
                          <CheckCircleIcon 
                            color="success" 
                            fontSize="small" 
                            sx={{ mr: 1, verticalAlign: 'middle' }}
                          />
                        )}
                        {option}
                        {optIndex === answers[index] && optIndex !== question.correctAnswer && (
                          <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                            (Your answer)
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      p: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: 1
                    }}
                  >
                    <strong>Explanation:</strong> {question.explanation}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {title}
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        {description}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {questions.map((question, index) => (
            <Step key={question.id}>
              <StepLabel>
                {`Question ${index + 1}`}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
          border: `1px solid ${theme.palette[ageGroup].light}`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              {activeStep + 1}. {questions[activeStep].question}
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
              <RadioGroup
                value={answers[activeStep].toString()}
                onChange={handleAnswerChange}
              >
                {questions[activeStep].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.03)'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            {showExplanation && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Explanation:</strong> {questions[activeStep].explanation}
                </Typography>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide Hint' : 'Show Hint'}
          </Button>
          
          {activeStep === questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={answers.includes(-1) || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <EmojiEventsIcon />}
            >
              {isSubmitting ? 'Submitting...' : 'Finish Quiz'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={answers[activeStep] === -1}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Chip
          icon={<EmojiEventsIcon />}
          label={`Passing Score: ${passingScore}%`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="body2" align="center" color="text.secondary">
        Complete the quiz to earn your NFT certificate!
      </Typography>
    </Box>
  );
};

export default QuizComponent;
