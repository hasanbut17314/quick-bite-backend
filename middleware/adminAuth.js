import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isAdmins = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth denied: No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = { _id: user._id };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message); // Log for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default isAdmins;
