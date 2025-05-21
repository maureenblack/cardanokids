import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockchainBuilder from '../components/Interactive/BlockchainBuilder';
import HashGenerator from '../components/Interactive/HashGenerator';
import TokenCreator from '../components/Interactive/TokenCreator';
import SmartContractSimulator from '../components/Interactive/SmartContractSimulator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`interactive-tabpanel-${index}`}
      aria-labelledby={`interactive-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `interactive-tab-${index}`,
    'aria-controls': `interactive-tabpanel-${index}`,
  };
}

const TestComponents: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Interactive Components Demo
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Typography variant="body1" paragraph>
        This page demonstrates all the interactive components created for the Cardano Kids platform. 
        Each tab shows a different component that teaches blockchain concepts in an engaging way.
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Blockchain Builder" {...a11yProps(0)} />
          <Tab label="Hash Generator" {...a11yProps(1)} />
          <Tab label="Token Creator" {...a11yProps(2)} />
          <Tab label="Smart Contract Simulator" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <BlockchainBuilder />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <HashGenerator />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TokenCreator />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SmartContractSimulator />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default TestComponents;
