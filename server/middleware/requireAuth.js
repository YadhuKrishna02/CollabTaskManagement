import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ _id }).select('_id role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};
