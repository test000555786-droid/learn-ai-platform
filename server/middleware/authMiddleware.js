const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('--- AUTH MIDDLEWARE ---');
  console.log('Authorization header:', req.headers.authorization);

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token' });
  }

  console.log('Token found, verifying...');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'EXISTS' : 'MISSING!');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    req.user = await User.findById(decoded.id).select('-password');
    console.log('User found:', req.user ? req.user.email : 'NOT FOUND');

    next();
  } catch (err) {
    console.log('Auth error:', err.message);
    res.status(401).json({ message: 'Token invalid: ' + err.message });
  }
};

module.exports = { protect };