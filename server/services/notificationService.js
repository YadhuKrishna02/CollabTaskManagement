import Notification from '../models/notificationModel.js'
import mongoose from 'mongoose';
export const createTaskService = async (reqBody) => {
    try {
        const { type, message, task, assignedUser, status } = reqBody
        const newNotification = new Notification({
            type,
            message,
            task: mongoose.Types.ObjectId(task._id),
            assigned_user: assignedUser,
            status: status
        });

        await newNotification.save();

        return newNotification;
    } catch (error) {
        console.log(error, 'error')
        throw new Error("Error creating notification:", + error.message);
    }
};




