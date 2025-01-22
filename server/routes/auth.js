import express from 'express';

// Controller functions
import { loginUserController, signupUserController } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/log-in', loginUserController);

// Signup route
router.post('/sign-up', signupUserController);

export default router;
