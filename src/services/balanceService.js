import axiosClient from "../api/axiosClient";

const balanceService = {

    async getGroupBalances(groupId) {

        const response =
            await axiosClient.get(
                `/groups/${groupId}/balances`
            );

        return response.data;
    },
};

export default balanceService;