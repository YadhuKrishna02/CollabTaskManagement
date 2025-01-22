import { createTaskService, getTasksService, updateTaskService, deleteTaskService, getSingleTaskService } from '../services/taskService.js';

export const createTask = async (req, res) => {
    try {
        const task = await createTaskService(req.body);
        console.log(task, 'ppp')
        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getTasks = async (req, res) => {
    try {
        const tasks = await getTasksService(req.user, req.query);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSingleTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTask = await getSingleTaskService(taskId);
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const io = req.app.get('io');
        const updatedTask = await updateTaskService(taskId, req.body, io);
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.log(error, 'rrr')
        res.status(400).json({ error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const deletedTask = await deleteTaskService(taskId);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
