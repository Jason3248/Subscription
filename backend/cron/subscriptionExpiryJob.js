const cron = require('node-cron');
const Subscription = require('../models/Subscription');


cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    const result = await Subscription.updateMany(
      { endDate: { $lt: now }, status: { $in: ['ACTIVE', 'UPGRADED', 'DOWNGRADED'] } },
      { $set: { status: 'EXPIRED' } }
    );

    console.log(`Subscription expiry job ran. Updated: ${result.modifiedCount}`);
  } catch (err) {
    console.error('Error running subscription expiry job:', err);
  }
});
