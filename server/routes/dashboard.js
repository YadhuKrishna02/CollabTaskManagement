import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js'

import {
    cardsDataController, chartDataController
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', cardsDataController);
router.get('/chartData', chartDataController);


export default router;
