const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },

  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'UPGRADED', 'DOWNGRADED'],
    default: 'ACTIVE'
  },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  previousSubscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
