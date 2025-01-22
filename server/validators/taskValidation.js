// src/validators/taskValidation.js
import Joi from 'joi';

const taskSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.min': 'Title should be at least 3 characters long',
        'any.required': 'Title is required',
    }),
    description: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high').required().messages({
        'any.required': 'Priority is required',
        'any.only': 'Priority must be one of low, medium, or high',
    }),
    status: Joi.string().valid('pending', 'in progress', 'completed').required().messages({
        'any.required': 'Status is required',
        'any.only': 'Status must be one of pending, in progress, or completed',
    }),
    assignedUser: Joi.array().required().messages({
        'any.required': 'Assigned user is required',
    }),
    dueDate: Joi.date().greater('now').optional().messages({
        'date.greater': 'Due date must be in the future',
    }),
});

export default taskSchema;
