import Task from '../models/taskModel.js';
import taskSchema from '../validators/taskValidation.js';
import mongoose from 'mongoose';
import { paginate } from '../utils/pagination.js';
import { convertToCamelCase } from '../utils/convertToCamelCase.js';
import dotenv from 'dotenv';
dotenv.config();


export const createTaskService = async (taskData) => {
    try {
        const { error } = taskSchema.validate(taskData, { abortEarly: false });
        if (error) {
            throw new Error(error.details.map(detail => detail.message).join(', '));
        }

        const { title, description, priority, status, assignedUser, dueDate } = taskData;

        // Check if the task already exists
        const existingTask = await Task.findOne({ title });
        if (existingTask) {
            throw new Error('Task with the same title already exists');
        }

        // Create a new task
        const task = await Task.create({
            title,
            description,
            priority,
            status,
            assigned_users: assignedUser,
            due_date: dueDate,
        });

        return task;
    } catch (error) {
        console.log(error, 'error')
        throw error
    }

};
export const getTasksService = async (user, reqQuery) => {
    try {
        const { userId = '', limit = 25, page = 1 } = reqQuery;
        const role = user.role
        const skip = (page - 1) * limit
        let query = {};
        if (role === 'admin') {
            query = {};
        } else if (user._id.equals(mongoose.Types.ObjectId(userId))) {
            query = { assigned_users: { $in: [mongoose.Types.ObjectId(userId)] } };
        }
        else {
            return {
                data: [],
                pagination: { limit, pageNo: page, offset: skip, totalCount: 0 },
            };
        }

        const dbResult = await Task.find(query)
            .populate('assigned_users', 'name email')
            .sort({ due_date: 1 })
            .skip(skip)
            .limit(parseInt(limit, 25))
            .lean();
        const totalCount = await Task.countDocuments(query);

        const pagination = paginate({ limit, pageNo: page, offset: skip }, totalCount);

        return {
            data: dbResult.map((user) => convertToCamelCase(user)),
            pagination,
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};
export const getSingleTaskService = async (taskId) => {
    try {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        return task;
    } catch (error) {
        throw new Error('Error deleting task: ' + error.message);
    }
}
export const updateTaskService = async (taskId, taskData, io) => {
    try {
        const { title, description, priority, status, dueDate, assignedUser } = taskData;

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (priority) updatedFields.priority = priority;
        if (status) updatedFields.status = status;
        if (dueDate) updatedFields.due_date = dueDate;
        if (assignedUser) updatedFields.assigned_users = assignedUser;

        // Find and update the task by its ID
        const updatedTask = await Task.findByIdAndUpdate(mongoose.Types.ObjectId(taskId), updatedFields, { new: true, runValidators: true });

        if (!updatedTask) {
            return null;
        }

        if (taskData.status && updatedTask) {
            console.log("Testing", updatedTask);
            io.emit('taskStatusUpdated', {
                taskId,
                updatedFields: {
                    status: updatedTask.status,
                    title: updatedTask.title,
                    assignedUsers: updatedTask.assigned_users,
                },
            });
        }
        // Return the updated task
        return updatedTask;
    } catch (error) {
        throw new Error('Error updating task: ' + error.message);
    }

};

export const deleteTaskService = async (taskId) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);

        return deletedTask;
    } catch (error) {
        throw new Error('Error deleting task: ' + error.message);
    }

};
