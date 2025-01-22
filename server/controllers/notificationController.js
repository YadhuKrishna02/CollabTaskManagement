import { createTaskService } from '../services/notificationService.js';
export const createTaskNotification = async (req, res) => {
    try {
        const result = await createTaskService(req.body);
        res.status(201).json({
            status: "success",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
