import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  CompareArrows as CompareArrowsIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Subscriptions as SubscriptionsIcon
} from '@mui/icons-material';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState(null);
  const [newPlanDetails, setNewPlanDetails] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [subRes, plansRes] = await Promise.all([
          api.get(`/subscriptions/${userId}`),
          api.get('/plans')
        ]);
        
        setSubscription(subRes.data);
        setPlans(plansRes.data);
        
        if (subRes.data) {
          setPlans(plansRes.data.filter(plan => plan._id !== subRes.data.plan._id));
        }
      } catch (err) {
        setError('Failed to fetch subscription data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleCancel = async () => {
    setCancelDialogOpen(false);
    
    try {
      await api.delete(`/subscriptions/${userId}`);
      setSuccessMessage('Your subscription has been cancelled successfully. Go to PLANS for subscrining to a new plan');
      const [subRes, plansRes] = await Promise.all([
        api.get(`/subscriptions/${userId}`),
        api.get('/plans')
      ]);
      setSubscription(subRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel subscription. Please try again.');
    }
  };

  const showPlanChangeComparison = (newPlanId) => {
    const currentPlan = subscription.plan;
    const newPlan = plans.find(plan => plan._id === newPlanId);
    
    setCurrentPlanDetails(currentPlan);
    setNewPlanDetails(newPlan);
    setShowPlanComparison(true);
  };

  const handlePlanChange = async () => {
    if (!selectedPlanId) {
      setError('Please select a plan');
      return;
    }

    try {
      const res = await api.put(`/subscriptions/${userId}`, { newPlanId: selectedPlanId });
      setSubscription(res.data.subscription);
      setSuccessMessage(res.data.message);
      setError('');
      setShowPlanComparison(false);
      
      const plansRes = await api.get('/plans');
      setPlans(plansRes.data.filter(plan => plan._id !== selectedPlanId));
      setSelectedPlanId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subscription. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const statusColors = {
      ACTIVE: 'success',
      CANCELLED: 'error',
      EXPIRED: 'warning',
      UPGRADED: 'info',
      DOWNGRADED: 'secondary'
    }
  

    return (
      <Chip 
        label={status} 
        color={statusColors[status] || 'default'} 
        variant="outlined"
        sx={{ ml: 1 }}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Subscription
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {subscription ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {subscription.plan.name} Plan
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  ${subscription.plan.price} for {subscription.plan.duration} days
                </Typography>
              </Box>
              {getStatusChip(subscription.status)}
            </Box>

            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Subscription Dates
                  </Typography>
                  <Typography>
                    <Box component="span" color="text.secondary">Start Date:</Box> {formatDate(subscription.startDate)}
                  </Typography>
                  <Typography>
                    <Box component="span" color="text.secondary">End Date:</Box> {formatDate(subscription.endDate)}
                  </Typography>
                  <Typography>
                    <Box component="span" color="text.secondary">Days Remaining: {Math.max(0, Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}</Box> 
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Plan Features
                  </Typography>
                  <List dense>
                    {subscription.plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {(subscription.status === 'ACTIVE' || subscription.status === 'UPGRADED' || subscription.status === 'DOWNGRADED') && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Manage Your Subscription
                </Typography>
                
                <Box mb={3}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-select-label">Change to another plan</InputLabel>
                    <Select
                      labelId="plan-select-label"
                      id="plan-select"
                      value={selectedPlanId}
                      label="Change to another plan"
                      onChange={(e) => {
                        setSelectedPlanId(e.target.value);
                        if (e.target.value) {
                          showPlanChangeComparison(e.target.value);
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a new plan</em>
                      </MenuItem>
                      {plans.map(plan => (
                        <MenuItem key={plan._id} value={plan._id}>
                          {plan.name} (${plan.price})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={2}>
                  
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <WarningIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No active subscription
          </Typography>
          <Typography color="text.secondary" paragraph>
            You don't have an active subscription plan.
          </Typography>
        </Paper>
      )}


      <Dialog open={showPlanComparison} onClose={() => setShowPlanComparison(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => setShowPlanComparison(false)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            Plan Comparison
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Current Plan
              </Typography>
              <Typography variant="h5" gutterBottom>
                {currentPlanDetails?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                ${currentPlanDetails?.price}
              </Typography>
              <List dense>
                {currentPlanDetails?.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                New Plan
              </Typography>
              <Typography variant="h5" gutterBottom>
                {newPlanDetails?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                ${newPlanDetails?.price}
              </Typography>
              <List dense>
                {newPlanDetails?.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlanComparison(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePlanChange}
            startIcon={<CheckIcon />}
          >
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your current subscription?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
          <Button 
            onClick={handleCancel}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionManagement;