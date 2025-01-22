import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import {

    createTaskNotification
} from '../controllers/notificationController.js';
const router = express.Router();

// Public route

// Apply `requireAuth` middleware to routes requiring authentication
router.use(requireAuth);

router.post('/', createTaskNotification);


export default router;
