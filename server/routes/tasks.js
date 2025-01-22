import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdminRole } from '../middleware/requireAdminRole.js';

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getSingleTask
} from '../controllers/taskController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', requireAdminRole, createTask);

router.get('/', getTasks);

router.get('/:taskId', getSingleTask);

router.put('/:taskId', updateTask);

router.delete('/:taskId', deleteTask);

export default router;
