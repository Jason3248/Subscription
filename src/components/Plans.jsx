import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import api from '../api';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  PriceChange as PriceChangeIcon,
  CalendarToday as CalendarTodayIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Plans = ({onSubscribed}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        setPlans(res.data);
      } catch (err) {
        setError('Failed to load plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsSubscribing(true);
    try {
      await api.post('/subscriptions', { planId: selectedPlan._id });
       if(onSubscribed) onSubscribed();
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="md" mx="auto" p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
     
    <Box maxWidth="lg" mx="auto" p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Choose Your Plan
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Select the plan that best fits your needs
      </Typography>
      
      <Grid container spacing={3} mt={2}>
        {plans.map(plan => (
          <Grid item xs={12} md={4} key={plan._id}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: selectedPlan?._id === plan._id ? 'primary.main' : 'divider',
                boxShadow: selectedPlan?._id === plan._id ? 3 : 0,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2
                }
              }}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <PriceChangeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h4" component="span">
                    ${plan.price}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={3}>
                  <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  <Typography color="text.secondary">
                    {plan.duration} days
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Features:
                </Typography>
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <Box p={2}>
                <Button
                  fullWidth
                  variant={selectedPlan?._id === plan._id ? "contained" : "outlined"}
                  startIcon={<ArrowForwardIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                  }}
                >
                  {selectedPlan?._id === plan._id ? "Selected" : "Select Plan"}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedPlan && (
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            size="large"
            disabled={isSubscribing}
            onClick={handleSubscribe}
            startIcon={<ArrowForwardIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            {isSubscribing ? 'Processing...' : `Subscribe to ${selectedPlan.name} Plan`}
          </Button>
        </Box>
      )}

      {!user && (
        <Paper elevation={0} sx={{ p: 3, mt: 4, bgcolor: 'warning.light' }}>
          <Box display="flex" alignItems="center">
            <WarningIcon color="warning" sx={{ mr: 2 }} />
            <Typography>
              You need to be logged in to subscribe to a plan. Please sign in or create an account.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Plans;