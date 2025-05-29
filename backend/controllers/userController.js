const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

exports.register = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({message: 'Email Already in Use. Please enter another Email'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email, 
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {

        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }

}

exports.login = async (req, res) => {
  try {

    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log("Trimmed Email:", trimmedEmail);
    console.log("Trimmed Password:", trimmedPassword);

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(400).json({ message: 'User not Found' });
    }
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
