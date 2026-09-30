import axiosClient from "../api/axiosClient";

const dashboardService = {

    async getDashboardData() {
        const response = await axiosClient.get("/dashboard");

        return response.data;
    },

};

export default dashboardService;