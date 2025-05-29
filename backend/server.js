const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://subscription-eight-sigma.vercel.app', 
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));


const planRoutes = require('./routes/planRoutes');
app.use('/plans', planRoutes);

const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/subscriptions', subscriptionRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);




mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

require('./cron/subscriptionExpiryJob');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
