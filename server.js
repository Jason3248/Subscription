const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


const planRoutes = require('./backend/routes/planRoutes');
app.use('/plans', planRoutes);

const subscriptionRoutes = require('./backend/routes/subscriptionRoutes');
app.use('/subscriptions', subscriptionRoutes);

const userRoutes = require('./backend/routes/userRoutes');
app.use('/users', userRoutes);




mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

require('./backend/cron/subscriptionExpiryJob');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
