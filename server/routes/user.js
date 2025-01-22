import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import {
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUserDetails,
} from '../controllers/userController.js';
import { requireAdminRole } from '../middleware/requireAdminRole.js';
const router = express.Router();

// Public route

// Apply `requireAuth` middleware to routes requiring authentication
router.use(requireAuth);

router.get('/', requireAdminRole, getAllUsers);
router.get('/:id', getUserDetails);
router.put('/:id', updateUserDetails);
router.delete('/:id', requireAdminRole, deleteUserDetails);

export default router;
