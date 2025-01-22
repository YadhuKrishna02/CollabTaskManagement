import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'Notification type is required'],
            enum: ['task-status-changed', 'task-created', 'task-completed'],
        },
        message: {
            type: String,
            required: [true, 'Notification message is required'],
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        assigned_user: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'in progress', 'completed'],
            default: 'pending',
        },

    },
    { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
