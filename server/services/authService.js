// services/userService.js
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import userSchema from '../validators/userValidation.js';

export const signupService = async (email, password, name, role = 'user') => {
    // Joi Validation
    const { error } = userSchema.validate({ email, password, name, role });
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Check if the email already exists
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({ email, password: hash, name, role });

    return user;
};

export const loginService = async (email, password) => {
    if (!email || !password) {
        throw new Error('All fields must be filled');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Incorrect password');
    }

    return user;
};
