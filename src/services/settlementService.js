import axiosClient from "../api/axiosClient";

const settlementService = {

    async getSettlementPlan(groupId) {
        const response = await axiosClient.get(
            `/groups/${groupId}/settlements`
        );

        return response.data;
    },

    async getAllSettlements() {
        const groupsResponse = await axiosClient.get("/groups");

        const groups = groupsResponse.data || [];

        const settlementResults = await Promise.all(
            groups.map(async (group) => {
                const settlements = await this.getSettlementPlan(group.id);

                return settlements.map((settlement) => ({
                    ...settlement,
                    groupId: group.id,
                    groupName: group.name,
                }));
            })
        );

        return settlementResults.flat();
    },
};

export default settlementService;