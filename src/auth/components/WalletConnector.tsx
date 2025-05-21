import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  useTheme,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { CardanoWalletConnection } from '../types';
import { useAuth } from '../AuthContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';

interface WalletOption {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const WalletConnector: React.FC = () => {
  const theme = useTheme();
  const { connectWallet, disconnectWallet, walletConnection, isLoading, error } = useAuth();
  
  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  // Define wallet options
  const walletOptions: WalletOption[] = [
    {
      id: 'nami',
      name: 'Nami',
      logo: 'https://namiwallet.io/favicon.ico',
      description: 'A browser-based wallet extension for the Cardano blockchain'
    },
    {
      id: 'eternl',
      name: 'Eternl',
      logo: 'https://eternl.io/favicon.ico',
      description: 'A feature-rich Cardano light wallet with advanced functionality'
    },
    {
      id: 'flint',
      name: 'Flint',
      logo: 'https://flint-wallet.com/favicon.ico',
      description: 'A simple, secure Cardano wallet for everyday use'
    },
    {
      id: 'yoroi',
      name: 'Yoroi',
      logo: 'https://yoroi-wallet.com/favicon.ico',
      description: 'A light wallet for Cardano built by Emurgo'
    }
  ];
  
  // Check which wallets are available in the browser
  useEffect(() => {
    const checkAvailableWallets = () => {
      if (typeof window === 'undefined' || !window.cardano) {
        setAvailableWallets([]);
        return;
      }
      
      const available = walletOptions.filter(wallet => 
        window.cardano && window.cardano[wallet.id]
      );
      
      setAvailableWallets(available);
    };
    
    checkAvailableWallets();
    
    // Check again if window.cardano changes
    const checkInterval = setInterval(checkAvailableWallets, 2000);
    
    return () => clearInterval(checkInterval);
  }, []);
  
  // Handle wallet connection
  const handleConnectWallet = async (walletId: string) => {
    try {
      setSelectedWallet(walletId);
      await connectWallet(walletId);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setSelectedWallet(null);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  };
  
  // Format ADA amount
  const formatAda = (lovelace: number): string => {
    const ada = lovelace / 1000000;
    return ada.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };
  
  // Render wallet connection status
  const renderWalletStatus = () => {
    if (!walletConnection) {
      return null;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Connected Wallet
            </Typography>
            <Chip 
              label="Connected" 
              color="success" 
              size="small" 
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle2" color="text.secondary">
                Wallet Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {walletConnection.walletName}
              </Typography>
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle2" color="text.secondary">
                Balance
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {walletConnection.balance 
                  ? `₳ ${formatAda(walletConnection.balance.lovelace)}`
                  : 'Not available'}
              </Typography>
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Stake Address
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {walletConnection.stakeAddress}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDisconnectWallet}
              disabled={isLoading}
            >
              Disconnect Wallet
            </Button>
          </Box>
        </Paper>
      </motion.div>
    );
  };
  
  // Render wallet options
  const renderWalletOptions = () => {
    if (walletConnection) {
      return null;
    }
    
    if (availableWallets.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          No Cardano wallets detected in your browser. Please install a compatible wallet extension.
        </Alert>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h6" gutterBottom>
          Select a Wallet
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {availableWallets.map((wallet) => (
            <Box sx={{ width: { xs: '100%', sm: '48%' } }} key={wallet.id}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleConnectWallet(wallet.id)}
                  disabled={isLoading || selectedWallet === wallet.id}
                  sx={{ p: 1 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={wallet.logo}
                        alt={`${wallet.name} logo`}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{wallet.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {wallet.description}
                        </Typography>
                      </Box>
                      {selectedWallet === wallet.id && (
                        <CircularProgress size={24} />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </motion.div>
    );
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Wallet Connection
        </Typography>
        
        <Button
          variant="text"
          color="primary"
          startIcon={<InfoIcon />}
          onClick={() => setInfoDialogOpen(true)}
        >
          Why Connect?
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}
      
      {/* Educational notice */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Parent/Teacher Accounts Only
        </Typography>
        <Typography variant="body2">
          Wallet connection is only available for parent and teacher accounts. Child accounts do not have direct access to blockchain wallets for safety reasons.
        </Typography>
      </Alert>
      
      {/* Wallet status or connection options */}
      {renderWalletStatus()}
      {renderWalletOptions()}
      
      {/* Safety information */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mt: 4, backgroundColor: theme.palette.grey[50] }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Safety Information
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>Educational Purpose:</strong> This wallet connection is for educational demonstrations only. It allows parents and teachers to show blockchain concepts using real examples.
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>Child Safety:</strong> Child accounts cannot connect to wallets or make transactions. All blockchain interactions for children are simulated for educational purposes.
        </Typography>
        
        <Typography variant="body2">
          <strong>Limited Permissions:</strong> We only request viewing permissions for your wallet. The platform cannot initiate transactions without your explicit approval through your wallet.
        </Typography>
      </Paper>
      
      {/* Information dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        aria-labelledby="wallet-info-dialog-title"
      >
        <DialogTitle id="wallet-info-dialog-title">
          Why Connect a Wallet?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Connecting a Cardano wallet to your parent/teacher account enables several educational features:
          </DialogContentText>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Demonstrate Real Blockchain Concepts</strong> - Show children how blockchain works with real examples
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>View Educational NFTs</strong> - Display achievement badges and certificates in a real wallet
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Enhanced Learning Experience</strong> - Bridge the gap between theory and practice
              </Typography>
            </Box>
          </Box>
          
          <DialogContentText sx={{ mt: 2 }}>
            <strong>Child Safety:</strong> Child accounts never have direct access to wallets or real assets. All child interactions with blockchain concepts are simulated in a safe, educational environment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletConnector;
