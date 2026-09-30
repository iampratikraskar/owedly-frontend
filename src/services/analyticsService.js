import axiosClient from "../api/axiosClient";

const analyticsService = {

    async getAnalytics() {
        const response = await axiosClient.get("/analytics");
        return response.data;
    },

};

export default analyticsService;