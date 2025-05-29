import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../context/authContext';
import Plans from './Plans';
import SubscriptionManagement from './SubscriptionManagement';

const HomePage = () => {
  const { logout } = useContext(AuthContext);
  const [activeComponent, setActiveComponent] = useState('plans');
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

const renderComponent = () => {
  switch (activeComponent) {
    case 'plans':
      return <Plans onSubscribed={() => setActiveComponent('subscriptions')} />;
    case 'subscriptions':
      return <SubscriptionManagement />;
    default:
      return <Plans onSubscribed={() => setActiveComponent('subscriptions')} />;
  }
};


  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Subscription Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setActiveComponent('plans')}>
            Plans
          </Button>
          <Button color="inherit" onClick={() => setActiveComponent('subscriptions')}>
            Subscribed Plans
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {renderComponent()}
      </Box>
    </div>
  );
};

export default HomePage;
