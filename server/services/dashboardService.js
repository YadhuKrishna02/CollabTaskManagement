import Task from '../models/taskModel.js'
import mongoose from 'mongoose';
export const getCardsData = async (role, userId) => {
    try {
        const matchCondition = role === 'admin'
            ? {} // No filtering for admin
            : { assigned_users: { $in: [mongoose.Types.ObjectId(userId)] } };

        const counts = await Task.aggregate([
            {
                $facet: {
                    totalTasks: [
                        { $match: matchCondition },
                        { $count: "count" }
                    ],
                    completedTasks: [
                        { $match: { ...matchCondition, status: "completed" } },
                        { $count: "count" }
                    ],
                    inProgressTasks: [
                        { $match: { ...matchCondition, status: "in progress" } },
                        { $count: "count" }
                    ],
                    pendingTasks: [
                        { $match: { ...matchCondition, status: "pending" } },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        return {
            totalTasks: counts[0].totalTasks[0]?.count || 0,
            completedTasks: counts[0].completedTasks[0]?.count || 0,
            inProgressTasks: counts[0].inProgressTasks[0]?.count || 0,
            pendingTasks: counts[0].pendingTasks[0]?.count || 0,
        };
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        throw error;
    }
};


export const getChartsData = async (role, userId) => {
    try {
        const matchCondition = role === 'admin'
            ? {}
            : { assigned_users: { $in: [mongoose.Types.ObjectId(userId)] } };
        const taskCounts = await Task.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: '$priority',
                    total: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    total: 1,
                },
            },
            {
                $sort: { name: 1 },
            },
        ]);
        return taskCounts
    } catch (error) {
        throw new Error('Error fetching chart data: ' + error.message);
    }
}

