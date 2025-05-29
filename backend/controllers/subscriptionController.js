const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

exports.createSubscription = async(req, res) => {

    try { 
    const userId = req.user;
    const {planId} = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });

    const existing = await Subscription.findOne({ user: userId, status: 'ACTIVE' });
    if (existing) return res.status(400).json({ message: 'You already have an active subscription.' });


    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.duration);

    const subscription = new Subscription({
        user: userId, 
        plan: planId,
        startDate,
        endDate,
        status: 'ACTIVE'
    });

    
    await subscription.save();
    res.status(200).json({message: 'Subscription Created Successfully'})

    } catch (error) {

        console.error('Error creating subscription:', error);
        res.status(500).json({ message: 'Server error while creating subscription.' });
    }
}

exports.getSubscription = async(req, res) => {

    try {
        const userId = req.user;

        const subscription = await Subscription.findOne({ user: userId})
        .populate('plan')
        .sort({ startDate: -1});

        if (!subscription) return res.status(404).json({ message: 'No subscription found for user.' });
        res.json(subscription);

 }  catch (error) {

        console.error('Error retrieving subscription:', error);
        res.status(500).json({ message: 'Server error while fetching subscription.' });
    }
}

exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user;

    const deletedSubscription = await Subscription.findOneAndDelete({
      user: userId,
      status: { $in: ['ACTIVE', 'UPGRADED', 'DOWNGRADED'] }

    });

    if (!deletedSubscription) {
      return res.status(404).json({ message: 'No active subscription found to cancel.' });
    }

    res.json({ message: 'Your subscription has been cancelled and removed successfully.' });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error while cancelling subscription.' });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.user;
    const { newPlanId } = req.body;

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) return res.status(404).json({ message: 'New plan not found.' });

    const currentSubscription = await Subscription.findOne({ user: userId });
    if (!currentSubscription) {
      return res.status(404).json({ message: 'No active subscription found.' });
    }

    const currentPlan = await Plan.findById(currentSubscription.plan);
    const now = new Date();

 
    const timeDiff = currentSubscription.endDate - now;
    const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const totalDays = remainingDays + newPlan.duration;

    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + totalDays);

    const newStatus = newPlan.price > currentPlan.price ? 'UPGRADED' : 'DOWNGRADED';

    currentSubscription.plan = newPlan._id;
    currentSubscription.startDate = now;
    currentSubscription.endDate = newEndDate;
    currentSubscription.status = newStatus;
    currentSubscription.previousPlan = currentPlan._id;

    await currentSubscription.save();

    const populatedSubscription = await Subscription.findById(currentSubscription._id).populate('plan');

    res.json({
      message: `Subscription ${newStatus.toLowerCase()} successfully`,
      subscription: populatedSubscription
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Server error while updating subscription.' });
  }
};

