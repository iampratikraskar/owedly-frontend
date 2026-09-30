import axiosClient from "../api/axiosClient";

const groupService = {

    async getMyGroups() {

        const response =
            await axiosClient.get("/groups");

        return response.data;
    },

    async getGroup(groupId) {

        const response =
            await axiosClient.get(`/groups/${groupId}`);

        return response.data;
    },

    async createGroup(data) {

        const response =
            await axiosClient.post("/groups", data);

        return response.data;
    },

    async addMember(groupId, userId) {

        const response =
            await axiosClient.post(
                `/groups/${groupId}/members`,
                { userId }
            );

        return response.data;
    },
};

export default groupService;