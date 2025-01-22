// src/validators/userValidation.js
import Joi from 'joi';

const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email not valid',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).regex(/[a-zA-Z0-9]{3,30}/).required().messages({
        'string.min': 'Password should be at least 8 characters long',
        'any.required': 'Password is required',
        'string.pattern.base': 'Password must contain at least one number and one letter',
    }),
    name: Joi.string().min(3).required().messages({
        'string.min': 'Name should be at least 3 characters long',
        'any.required': 'Name is required',
    }),
    role: Joi.string().valid('user', 'admin').default('user'),
});

export default userSchema;
