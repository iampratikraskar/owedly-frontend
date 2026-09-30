import axiosClient from "../api/axiosClient";

const activityService = {
    async getMyActivities(limit = 20) {
        const response = await axiosClient.get("/activities", {
            params: { limit },
        });

        return response.data;
    },

    async getGroupActivities(groupId, limit = 20) {
        const response = await axiosClient.get(
            `/activities/groups/${groupId}`,
            {
                params: { limit },
            }
        );

        return response.data;
    },
};

export default activityService;