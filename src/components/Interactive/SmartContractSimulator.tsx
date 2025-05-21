import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Avatar,
  Chip,
  Alert,
  useTheme,
  Collapse
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAgeGroup } from '../../context/AgeGroupContext';

// Wallet interface
interface Wallet {
  id: string;
  name: string;
  balance: number;
  avatar: string;
}

// Transaction interface
interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

// Smart contract interface
interface SmartContract {
  id: string;
  name: string;
  description: string;
  code: string;
  creator: string;
  balance: number;
  rules: Array<{
    condition: string;
    action: string;
  }>;
}

/**
 * SmartContractSimulator Component
 * 
 * An interactive component that simulates how smart contracts work on the Cardano blockchain.
 * Users can create wallets, deploy contracts, and execute transactions to see how smart contracts
 * automatically enforce rules.
 */
const SmartContractSimulator: React.FC<{ advanced?: boolean }> = ({ advanced = false }) => {
  const theme = useTheme();
  const { ageGroup } = useAgeGroup();
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: 'wallet1',
      name: 'Alice',
      balance: 100,
      avatar: '👧'
    },
    {
      id: 'wallet2',
      name: 'Bob',
      balance: 100,
      avatar: '👦'
    }
  ]);
  
  const [contracts, setContracts] = useState<SmartContract[]>([
    {
      id: 'contract1',
      name: 'Allowance Contract',
      description: 'A contract that gives an allowance once per week',
      code: 'if (currentTime > lastPayment + 7 days) {\n  transfer(10, owner, recipient);\n  lastPayment = currentTime;\n}',
      creator: 'wallet1',
      balance: 50,
      rules: [
        {
          condition: 'If it has been at least 7 days since the last payment',
          action: 'Send 10 ADA to the recipient'
        }
      ]
    }
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('wallet1');
  const [selectedContract, setSelectedContract] = useState<string>('contract1');
  const [transferAmount, setTransferAmount] = useState<number>(10);
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [newContractName, setNewContractName] = useState<string>('');
  const [newContractDescription, setNewContractDescription] = useState<string>('');
  const [newContractRule, setNewContractRule] = useState<string>('');
  
  // Generate a unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Find a wallet by ID
  const findWallet = (id: string): Wallet | undefined => {
    return wallets.find(wallet => wallet.id === id);
  };
  
  // Find a contract by ID
  const findContract = (id: string): SmartContract | undefined => {
    return contracts.find(contract => contract.id === id);
  };
  
  // Execute a transaction
  const executeTransaction = () => {
    if (!selectedWallet || !selectedContract || transferAmount <= 0) return;
    
    const wallet = findWallet(selectedWallet);
    const contract = findContract(selectedContract);
    
    if (!wallet || !contract) return;
    
    // Check if wallet has enough balance
    if (wallet.balance < transferAmount) {
      const failedTransaction: Transaction = {
        id: generateId(),
        from: wallet.id,
        to: contract.id,
        amount: transferAmount,
        timestamp: Date.now(),
        status: 'failed',
        message: 'Not enough funds in wallet'
      };
      
      setTransactions([failedTransaction, ...transactions]);
      return;
    }
    
    // Create a successful transaction
    const newTransaction: Transaction = {
      id: generateId(),
      from: wallet.id,
      to: contract.id,
      amount: transferAmount,
      timestamp: Date.now(),
      status: 'completed',
      message: transferMessage
    };
    
    // Update wallet and contract balances
    const updatedWallets = wallets.map(w => {
      if (w.id === wallet.id) {
        return { ...w, balance: w.balance - transferAmount };
      }
      return w;
    });
    
    const updatedContracts = contracts.map(c => {
      if (c.id === contract.id) {
        return { ...c, balance: c.balance + transferAmount };
      }
      return c;
    });
    
    setWallets(updatedWallets);
    setContracts(updatedContracts);
    setTransactions([newTransaction, ...transactions]);
    setTransferAmount(10);
    setTransferMessage('');
    
    // Trigger contract execution based on rules
    setTimeout(() => {
      executeSmartContract(contract.id);
    }, 1500);
  };
  
  // Execute a smart contract based on its rules
  const executeSmartContract = (contractId: string) => {
    const contract = findContract(contractId);
    if (!contract) return;
    
    // Simulate contract execution
    // For educational purposes, we'll just transfer funds back to a random wallet
    if (contract.balance > 0) {
      const randomWalletIndex = Math.floor(Math.random() * wallets.length);
      const recipientWallet = wallets[randomWalletIndex];
      const transferAmount = Math.min(10, contract.balance);
      
      // Create a contract-initiated transaction
      const contractTransaction: Transaction = {
        id: generateId(),
        from: contract.id,
        to: recipientWallet.id,
        amount: transferAmount,
        timestamp: Date.now(),
        status: 'completed',
        message: 'Smart contract automatic execution'
      };
      
      // Update balances
      const updatedWallets = wallets.map(w => {
        if (w.id === recipientWallet.id) {
          return { ...w, balance: w.balance + transferAmount };
        }
        return w;
      });
      
      const updatedContracts = contracts.map(c => {
        if (c.id === contract.id) {
          return { ...c, balance: c.balance - transferAmount };
        }
        return c;
      });
      
      setWallets(updatedWallets);
      setContracts(updatedContracts);
      setTransactions([contractTransaction, ...transactions]);
    }
  };
  
  // Create a new smart contract
  const createSmartContract = () => {
    if (!newContractName || !selectedWallet) return;
    
    const newContract: SmartContract = {
      id: generateId(),
      name: newContractName,
      description: newContractDescription || 'Custom smart contract',
      code: 'if (condition) {\n  transfer(amount, from, to);\n}',
      creator: selectedWallet,
      balance: 0,
      rules: [
        {
          condition: newContractRule || 'When funds are received',
          action: 'Execute the defined logic'
        }
      ]
    };
    
    setContracts([...contracts, newContract]);
    setSelectedContract(newContract.id);
    setNewContractName('');
    setNewContractDescription('');
    setNewContractRule('');
    setShowAdvancedOptions(false);
  };
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle reset
  const handleReset = () => {
    setActiveStep(0);
  };
  
  // Steps for the guided tutorial
  const steps = [
    {
      label: 'What is a Smart Contract?',
      description: advanced 
        ? 'Smart contracts are self-executing contracts with the terms directly written into code. On Cardano, smart contracts are written in Plutus, a functional programming language based on Haskell.'
        : 'A smart contract is like a robot helper that automatically follows rules. When something happens, the smart contract does what it was programmed to do without needing anyone to tell it.',
    },
    {
      label: 'How Smart Contracts Work',
      description: advanced
        ? 'Smart contracts execute automatically when predefined conditions are met. They can hold funds, transfer assets, and interact with other contracts based on their programming.'
        : 'Smart contracts work by watching for certain things to happen. When those things happen, the smart contract automatically does what it was told to do, like sending tokens to someone.',
    },
    {
      label: 'Try It Yourself',
      description: 'Now you can try interacting with a smart contract! Send some funds to the contract and see what happens based on the rules.',
    },
  ];
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {advanced ? 'Smart Contract Simulator' : 'Magic Robot Helpers'}
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => setShowExplanation(!showExplanation)}
        sx={{ mb: 3, display: 'block', mx: 'auto' }}
      >
        {showExplanation ? 'Hide Explanation' : 'What are Smart Contracts?'}
      </Button>
      
      <Collapse in={showExplanation}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3, 
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body1" paragraph>
            {advanced 
              ? 'Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met. They are used to automate the execution of agreements without an intermediary.'
              : 'Smart contracts are like robot helpers that follow rules. They automatically do things when certain conditions are met, without needing anyone to tell them what to do.'}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {advanced
              ? 'On Cardano, smart contracts are written in Plutus, which is based on Haskell. They provide a secure and efficient way to implement complex logic on the blockchain.'
              : 'For example, a smart contract could automatically give you your allowance every week, or release your tokens when you complete a task.'}
          </Typography>
          
          <Typography variant="body1">
            {advanced
              ? 'This simulator demonstrates the basic principles of how smart contracts work, although real Cardano smart contracts have additional features and security measures.'
              : 'In this activity, you can see how these robot helpers work by sending them tokens and watching what they do!'}
          </Typography>
        </Paper>
      </Collapse>
      
      {/* Guided Tutorial */}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="subtitle1">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {step.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                >
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === steps.length && (
        <Box sx={{ mb: 4 }}>
          <Paper square elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tutorial complete - now try it yourself!
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Restart Tutorial
            </Button>
          </Paper>
        </Box>
      )}
      
      <Grid container spacing={4}>
        {/* Wallets Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              height: '100%',
              border: `1px solid ${theme.palette[ageGroup].light}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {advanced ? 'Wallets' : 'Your Money Bags'}
            </Typography>
            
            <Grid container spacing={2}>
              {wallets.map((wallet) => (
                <Grid item xs={12} sm={6} key={wallet.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      border: selectedWallet === wallet.id 
                        ? `2px solid ${theme.palette[ageGroup].main}` 
                        : '1px solid rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                    onClick={() => setSelectedWallet(wallet.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            mr: 1, 
                            backgroundColor: theme.palette[ageGroup].light,
                            fontSize: '1.5rem'
                          }}
                        >
                          {wallet.avatar}
                        </Avatar>
                        <Typography variant="h6">
                          {wallet.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          Balance: {wallet.balance} ADA
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    {selectedWallet === wallet.id && (
                      <CardActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', justifyContent: 'center' }}>
                        <Chip 
                          label="Selected" 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Smart Contracts Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              height: '100%',
              border: `1px solid ${theme.palette[ageGroup].light}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {advanced ? 'Smart Contracts' : 'Robot Helpers'}
              </Typography>
              
              <Button 
                size="small" 
                color="primary" 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? 'Cancel' : (advanced ? 'Create New' : 'Make New')}
              </Button>
            </Box>
            
            <AnimatePresence>
              {showAdvancedOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      borderRadius: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {advanced ? 'Create New Smart Contract' : 'Make a New Robot Helper'}
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      size="small"
                      value={newContractName}
                      onChange={(e) => setNewContractName(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      size="small"
                      value={newContractDescription}
                      onChange={(e) => setNewContractDescription(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label={advanced ? "Rule Condition" : "What should it do?"}
                      variant="outlined"
                      size="small"
                      value={newContractRule}
                      onChange={(e) => setNewContractRule(e.target.value)}
                      sx={{ mb: 2 }}
                      placeholder={advanced ? "e.g., When funds are received..." : "e.g., Give tokens every week"}
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={createSmartContract}
                      disabled={!newContractName}
                      fullWidth
                    >
                      {advanced ? 'Deploy Contract' : 'Create Helper'}
                    </Button>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Grid container spacing={2}>
              {contracts.map((contract) => (
                <Grid item xs={12} key={contract.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      border: selectedContract === contract.id 
                        ? `2px solid ${theme.palette[ageGroup].main}` 
                        : '1px solid rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                    onClick={() => setSelectedContract(contract.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                          {contract.name}
                        </Typography>
                        <Chip 
                          icon={<CodeIcon />} 
                          label={advanced ? "Smart Contract" : "Robot Helper"} 
                          size="small" 
                          color="secondary"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {contract.description}
                      </Typography>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        {advanced ? 'Contract Rules:' : 'What This Helper Does:'}
                      </Typography>
                      
                      {contract.rules.map((rule, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <b>If:</b> {rule.condition}
                          </Typography>
                          <Typography variant="body2">
                            <b>Then:</b> {rule.action}
                          </Typography>
                        </Box>
                      ))}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <AccountBalanceWalletIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          Balance: {contract.balance} ADA
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    {selectedContract === contract.id && (
                      <CardActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', justifyContent: 'center' }}>
                        <Chip 
                          label="Selected" 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Transaction Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              border: `1px solid ${theme.palette[ageGroup].light}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {advanced ? 'Execute Transaction' : 'Send Tokens to Robot Helper'}
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Message (optional)"
                  variant="outlined"
                  value={transferMessage}
                  onChange={(e) => setTransferMessage(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={executeTransaction}
                  disabled={!selectedWallet || !selectedContract || transferAmount <= 0}
                  endIcon={<SendIcon />}
                  sx={{ height: '56px' }}
                >
                  {advanced ? 'Execute' : 'Send'}
                </Button>
              </Grid>
            </Grid>
            
            {/* Transaction History */}
            {transactions.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {advanced ? 'Transaction History' : 'What Happened'}
                </Typography>
                
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: transaction.status === 'completed' 
                          ? 'rgba(76, 175, 80, 0.1)' 
                          : 'rgba(244, 67, 54, 0.1)',
                        border: transaction.status === 'completed'
                          ? '1px solid rgba(76, 175, 80, 0.3)'
                          : '1px solid rgba(244, 67, 54, 0.3)'
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          {transaction.status === 'completed' ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <ErrorIcon color="error" />
                          )}
                        </Grid>
                        
                        <Grid item xs>
                          <Typography variant="body2">
                            <b>From:</b> {findWallet(transaction.from)?.name || findContract(transaction.from)?.name || transaction.from}
                          </Typography>
                          <Typography variant="body2">
                            <b>To:</b> {findWallet(transaction.to)?.name || findContract(transaction.to)?.name || transaction.to}
                          </Typography>
                          <Typography variant="body2">
                            <b>Amount:</b> {transaction.amount} ADA
                          </Typography>
                          {transaction.message && (
                            <Typography variant="body2">
                              <b>Message:</b> {transaction.message}
                            </Typography>
                          )}
                        </Grid>
                        
                        <Grid item>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                ))}
                
                {transactions.length > 5 && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Showing 5 most recent transactions of {transactions.length} total
                  </Typography>
                )}
              </Box>
            )}
            
            {transactions.length === 0 && (
              <Alert 
                severity="info" 
                icon={<InfoIcon />}
                sx={{ mt: 3 }}
              >
                {advanced 
                  ? 'No transactions yet. Select a wallet and contract, then execute a transaction to see how smart contracts work.'
                  : 'No tokens sent yet. Choose a money bag and a robot helper, then send some tokens to see what happens!'}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mt: 4, 
          borderRadius: 3, 
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          border: '1px dashed rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="body1" paragraph>
          {advanced 
            ? "This is a simplified simulation of how smart contracts work on Cardano. Real smart contracts on Cardano are written in Plutus and have more advanced features and security measures."
            : "Great job! You've learned how robot helpers (smart contracts) can automatically do things when you send them tokens. In the real Cardano blockchain, these helpers can do all sorts of cool things!"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SmartContractSimulator;
