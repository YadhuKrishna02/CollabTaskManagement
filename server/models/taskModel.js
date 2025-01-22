import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            minlength: [3, 'Task title must be at least 3 characters long'],
            maxlength: [100, 'Task title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            maxlength: [500, 'Task description cannot exceed 500 characters'],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: [true, 'Priority is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'in progress', 'completed'],
            required: [true, 'Status is required'],
            default: 'pending',
        },
        assigned_users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        due_date: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value > new Date();
                },
                message: 'Due date must be a future date',
            },
        },
    },
    { timestamps: true }
);

taskSchema.index({ assigned_users: 1 })

export default mongoose.model('Task', taskSchema);


