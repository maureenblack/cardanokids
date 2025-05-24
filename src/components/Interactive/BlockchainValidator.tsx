import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  Avatar,
  Chip,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAgeGroup } from '../../context/AgeGroupContext';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  isValid: boolean;
  reason?: string;
  image: string;
}

interface BlockchainValidatorProps {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onComplete?: (score: number) => void;
}

const BlockchainValidator: React.FC<BlockchainValidatorProps> = ({ 
  title = "Blockchain Validator Game", 
  description = "Help validate transactions for the blockchain! Check if each transaction is valid or not.", 
  difficulty = 'easy',
  onComplete 
}) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, severity: 'success' | 'error' | 'info'} | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [timerActive, setTimerActive] = useState(false);

  const handleTimeout = () => {
    setFeedback({
      message: "Time's up! Let's see how you did.",
      severity: 'info'
    });
    setShowFeedback(true);
    endGame();
  };

  const generateTransactions = () => {
    // Characters for transactions
    const characters = [
      { name: 'Ada', image: 'https://img.freepik.com/free-vector/cute-girl-gaming-holding-controller-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg' },
      { name: 'Captain Block', image: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg' },
      { name: 'Professor Ledger', image: 'https://img.freepik.com/free-vector/cute-boy-scientist-cartoon-vector-icon-illustration-people-science-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3851.jpg' },
      { name: 'Blocky', image: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg' },
      { name: 'Crypto Cat', image: 'https://img.freepik.com/free-vector/cute-cat-with-laptop-cartoon-vector-icon-illustration-animal-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4057.jpg' }
    ];
    
    // Generate valid transactions
    const validTransactions: Transaction[] = Array.from({ length: 5 }, (_, i) => {
      const fromChar = characters[Math.floor(Math.random() * characters.length)];
      let toChar = characters[Math.floor(Math.random() * characters.length)];
      
      // Make sure from and to are different
      while (toChar.name === fromChar.name) {
        toChar = characters[Math.floor(Math.random() * characters.length)];
      }
      
      return {
        id: `tx-${i}-valid`,
        from: fromChar.name,
        to: toChar.name,
        amount: Math.floor(Math.random() * 10) + 1,
        isValid: true,
        image: fromChar.image
      };
    });
    
    // Generate invalid transactions based on difficulty
    const invalidReasons = [
      { reason: 'The sender does not have enough tokens', difficulty: 'easy' },
      { reason: 'The sender address does not exist', difficulty: 'easy' },
      { reason: 'The transaction is missing a signature', difficulty: 'medium' },
      { reason: 'The transaction has an invalid format', difficulty: 'medium' },
      { reason: 'The transaction is trying to spend tokens that were already spent', difficulty: 'hard' },
      { reason: 'The transaction has an invalid timestamp', difficulty: 'hard' }
    ];
    
    // Filter reasons based on difficulty
    const availableReasons = invalidReasons.filter(r => {
      if (difficulty === 'easy') return r.difficulty === 'easy';
      if (difficulty === 'medium') return r.difficulty === 'easy' || r.difficulty === 'medium';
      return true; // All reasons for hard difficulty
    });
    
    const invalidTransactions: Transaction[] = Array.from({ length: 5 }, (_, i) => {
      const fromChar = characters[Math.floor(Math.random() * characters.length)];
      let toChar = characters[Math.floor(Math.random() * characters.length)];
      
      // Make sure from and to are different
      while (toChar.name === fromChar.name) {
        toChar = characters[Math.floor(Math.random() * characters.length)];
      }
      
      const reasonObj = availableReasons[Math.floor(Math.random() * availableReasons.length)];
      
      return {
        id: `tx-${i}-invalid`,
        from: fromChar.name,
        to: toChar.name,
        amount: Math.floor(Math.random() * 10) + 1,
        isValid: false,
        reason: reasonObj.reason,
        image: fromChar.image
      };
    });
    
    // Combine and shuffle transactions
    const allTransactions = [...validTransactions, ...invalidTransactions];
    for (let i = allTransactions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTransactions[i], allTransactions[j]] = [allTransactions[j], allTransactions[i]];
    }
    
    setTransactions(allTransactions);
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(100);
  };

  // Generate transactions based on difficulty
  useEffect(() => {
    generateTransactions();
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 100);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeLeft]);

  // Start timer when component mounts
  useEffect(() => {
    setTimerActive(true);
    return () => setTimerActive(false);
  }, []);

  const handleValidate = (isValid: boolean) => {
    const currentTx = transactions[currentIndex];
    
    if (currentTx.isValid === isValid) {
      // Correct answer
      setScore(prev => prev + 1);
      setFeedback({
        message: "Correct! Good job validating that transaction.",
        severity: 'success'
      });
    } else {
      // Incorrect answer
      setFeedback({
        message: `Incorrect. This transaction was ${currentTx.isValid ? 'valid' : 'invalid'}${currentTx.reason ? ` because: ${currentTx.reason}` : ''}.`,
        severity: 'error'
      });
    }
    
    setShowFeedback(true);
    
    // Move to next transaction or end game
    if (currentIndex < transactions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowFeedback(false);
      }, 2000);
    } else {
      setTimeout(() => {
        endGame();
      }, 2000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    setTimerActive(false);
    if (onComplete) {
      onComplete(score);
    }
  };

  const restartGame = () => {
    generateTransactions();
    setTimeLeft(100);
    setTimerActive(true);
  };

  const currentTransaction = transactions[currentIndex];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette[ageGroup].light}20 0%, ${theme.palette[ageGroup].light}50 100%)`,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Chip 
              label={`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`} 
              color={
                difficulty === 'easy' ? 'success' : 
                difficulty === 'medium' ? 'warning' : 
                'error'
              }
              sx={{ mr: 1 }}
            />
            <Chip 
              label={`Score: ${score}/${transactions.length}`} 
              color="primary"
            />
          </Box>
        </Box>

        {/* Timer */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={timeLeft} 
            color={
              timeLeft > 66 ? 'success' :
              timeLeft > 33 ? 'warning' :
              'error'
            }
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {!gameOver && transactions.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3,
                  mb: 3,
                  overflow: 'hidden'
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={4} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: theme.palette.background.paper
                  }}>
                    <Avatar 
                      src={currentTransaction?.image} 
                      alt={currentTransaction?.from}
                      sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {currentTransaction?.from}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Sender
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Transaction #{currentIndex + 1}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>From:</strong> {currentTransaction?.from}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>To:</strong> {currentTransaction?.to}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Amount:</strong> {currentTransaction?.amount} Cardano Tokens
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Transaction ID:</strong> {currentTransaction?.id}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Is this transaction valid? Check carefully before deciding!
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleValidate(true)}
                          size="large"
                          sx={{ width: '48%' }}
                        >
                          Valid
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleValidate(false)}
                          size="large"
                          sx={{ width: '48%' }}
                        >
                          Invalid
                        </Button>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </AnimatePresence>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <EmojiEventsIcon sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Game Complete!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Your Score: {score}/{transactions.length}
              </Typography>
              <Typography variant="body1" paragraph>
                {score === transactions.length 
                  ? "Perfect score! You're a blockchain validation expert!" 
                  : score >= transactions.length / 2 
                    ? "Good job! You're getting better at validating transactions." 
                    : "Keep practicing! Validating transactions takes practice."}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={restartGame}
                startIcon={<RestartAltIcon />}
                sx={{ mt: 2 }}
              >
                Play Again
              </Button>
            </motion.div>
          </Box>
        )}

        {/* Feedback snackbar */}
        <Snackbar 
          open={showFeedback} 
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={feedback?.severity || 'info'} variant="filled">
            {feedback?.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default BlockchainValidator;
