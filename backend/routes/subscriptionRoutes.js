const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middlewares/auth');


router.post('/', auth, subscriptionController.createSubscription);

router.get('/:userId', auth, subscriptionController.getSubscription);

router.put('/:userId', auth, subscriptionController.updateSubscription);

router.delete('/:userId', auth, subscriptionController.cancelSubscription);

module.exports = router;
