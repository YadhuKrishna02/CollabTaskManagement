
import { ROLES } from '../constants/roles.js';
import User from '../models/userModel.js';
import { convertToCamelCase } from '../utils/convertToCamelCase.js';
import { paginate } from '../utils/pagination.js';
import mongoose from 'mongoose';

export const getUsers = async (query) => {
    const { page = 1, limit = 10, ...filters } = query;
    filters.role = ROLES['USER'];

    const skip = (page - 1) * limit;

    // Fetch total document count and filtered user data
    const totalCount = await User.estimatedDocumentCount(filters);
    const dbResult = await User.find(filters)
        .select('-password')
        .sort('name')
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean();
    // Generate pagination metadata
    const pagination = paginate({ limit, pageNo: page, offset: skip }, totalCount);

    return {
        data: dbResult.map((user) => convertToCamelCase(user)),
        pagination,
    };
};




export const getUserById = async (userId) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password');
        console.log(user)
        return user

    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (id, updateData) => {
    return User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUser = async (id) => {
    return User.findByIdAndDelete(id);
};
