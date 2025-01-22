import { getCardsData, getChartsData } from '../services/dashboardService.js';
export const cardsDataController = async (req, res) => {
    try {
        const { role, userId } = req.query
        const cardsData = await getCardsData(role, userId);
        res.status(201).json({
            status: "success",
            data: cardsData,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const chartDataController = async (req, res) => {
    try {
        const { role, userId } = req.query
        const chartsData = await getChartsData(role, userId);
        res.status(201).json({
            status: "success",
            data: chartsData,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};