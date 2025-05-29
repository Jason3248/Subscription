const Plan = require('../models/Plan');

exports.createPlan = async (req, res) => {
    try {
        const { name, price, features, duration, isActive} = req.body;

        const plan = new Plan({
            name, 
            price,
            features: features || [],
            duration,
            isActive
        });

        await plan.save();
        res.status(201).json(plan);

    } catch (error) {

        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Server error while creating plan.' });
    }
}

exports.getPlans = async (req, res) => {
    
    try {
        const filter = {};
        if(req.query.isActive){
            filter.isActive = req.query.isActive === 'true';
        }
        const plans = await Plan.find(filter);
        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Server error while fetching plans.' });

    }
}