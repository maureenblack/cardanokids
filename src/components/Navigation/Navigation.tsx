import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Info as InfoIcon,
  AccountCircle,
  ChildCare,
  SupervisorAccount,
  Logout,
  ArrowDropDown,
} from '@mui/icons-material';
import { useAgeGroup, AgeRange, ageRanges } from '../../context/AgeGroupContext';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { ageRange, ageGroup, setAgeRange } = useAgeGroup();
  const { isAuthenticated, user, logout, switchToParentMode, switchToChildMode } = useAuth();
  
  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // State for age selector menu
  const [ageMenuAnchor, setAgeMenuAnchor] = useState<null | HTMLElement>(null);
  
  // State for user menu
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Toggle drawer
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  
  // Handle age menu open
  const handleAgeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAgeMenuAnchor(event.currentTarget);
  };
  
  // Handle age menu close
  const handleAgeMenuClose = () => {
    setAgeMenuAnchor(null);
  };
  
  // Handle age range selection
  const handleAgeRangeSelect = (range: AgeRange) => {
    setAgeRange(range);
    handleAgeMenuClose();
  };
  
  // Handle user menu open
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };
  
  // Handle switch to parent mode
  const handleSwitchToParentMode = () => {
    switchToParentMode();
    handleUserMenuClose();
  };
  
  // Handle switch to child mode
  const handleSwitchToChildMode = () => {
    switchToChildMode();
    handleUserMenuClose();
  };
  
  // Navigation items
  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Learning Modules', icon: <SchoolIcon />, path: '/learning' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ];
  
  // Get color based on age group
  const getAgeGroupColor = () => {
    return theme.palette[ageGroup].main;
  };
  
  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component="img"
          src={require('../../assets/images/cardanokids-logo.png')}
          alt="Cardano Kids Logo"
          sx={{ height: 80, width: 'auto' }}
        />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text}
            sx={{
              bgcolor: location.pathname === item.path ? `${theme.palette[ageGroup].light}30` : 'transparent',
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <Box
              component={RouterLink}
              to={item.path}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%',
                textDecoration: 'none',
                color: 'inherit',
                py: 1,
                px: 2
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </Box>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Age Group
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ageRanges.map((range) => (
            <Button
              key={range}
              variant={range === ageRange ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleAgeRangeSelect(range)}
              sx={{
                backgroundColor: range === ageRange ? getAgeGroupColor() : 'transparent',
                borderColor: getAgeGroupColor(),
                color: range === ageRange ? 'white' : getAgeGroupColor(),
              }}
            >
              {range} years
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Box
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={require('../../assets/images/cardanokids-logo.png')}
              alt="Cardano Kids Logo"
              sx={{ height: 70, mr: 1 }}
            />
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    mx: 1,
                    borderBottom: location.pathname === item.path ? `2px solid ${getAgeGroupColor()}` : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      borderBottom: `2px solid ${getAgeGroupColor()}`,
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Tooltip title="Select age group">
              <Button
                onClick={handleAgeMenuOpen}
                endIcon={<ArrowDropDown />}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: getAgeGroupColor(),
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette[ageGroup].dark,
                  },
                }}
              >
                {ageRange} years
              </Button>
            </Tooltip>
            <Menu
              anchorEl={ageMenuAnchor}
              open={Boolean(ageMenuAnchor)}
              onClose={handleAgeMenuClose}
            >
              {ageRanges.map((range) => (
                <MenuItem
                  key={range}
                  onClick={() => handleAgeRangeSelect(range)}
                  selected={range === ageRange}
                >
                  {range} years
                </MenuItem>
              ))}
            </Menu>
            
            {isAuthenticated && user ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={Boolean(userMenuAnchor) ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(userMenuAnchor) ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: getAgeGroupColor() }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchor}
                  id="account-menu"
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <Avatar /> {user.name}
                  </MenuItem>
                  <Divider />
                  {user.role === 'child' && (
                    <MenuItem onClick={handleSwitchToParentMode}>
                      <ListItemIcon>
                        <SupervisorAccount fontSize="small" />
                      </ListItemIcon>
                      Parent Mode
                    </MenuItem>
                  )}
                  {user.role === 'parent' && (
                    <MenuItem onClick={handleSwitchToChildMode}>
                      <ListItemIcon>
                        <ChildCare fontSize="small" />
                      </ListItemIcon>
                      Child Mode
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                startIcon={<AccountCircle />}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;
