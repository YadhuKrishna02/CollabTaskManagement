// controllers/userController.js
import { signupService, loginService } from '../services/authService.js';
import jwt from 'jsonwebtoken';

const createToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });

// Login a user
export const loginUserController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginService(email, password);

        // Create a token
        const token = createToken(user._id);

        const userResponse = { ...user._doc }; // Spread `_doc` to get a plain object
        delete userResponse.password;

        return res.status(201).json({
            status: "success",
            message: "You're Logged in successfully",
            data: {
                email,
                token,
                user: userResponse,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Signup a user
export const signupUserController = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const user = await signupService(email, password, name, role);

        const token = createToken(user._id);
        const userResponse = { ...user._doc }; // Spread `_doc` to get a plain object
        delete userResponse.password;

        return res.status(201).json({
            status: "success",
            message: "You're  registered successfully",
            data: {
                email,
                token,
                user: userResponse,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

