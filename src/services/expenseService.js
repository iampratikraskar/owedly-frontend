import axiosClient from "../api/axiosClient";

const expenseService = {

    async getGroupExpenses(groupId) {
        const response = await axiosClient.get(
            `/groups/${groupId}/expenses`
        );

        return response.data;
    },

    async getExpense(expenseId) {
        const response = await axiosClient.get(
            `/expenses/${expenseId}`
        );

        return response.data;
    },

    async createExpense(groupId, data) {
        const response = await axiosClient.post(
            `/groups/${groupId}/expenses`,
            data
        );

        return response.data;
    },

    async updateExpense(expenseId, data) {
        const response = await axiosClient.put(
            `/expenses/${expenseId}`,
            data
        );

        return response.data;
    },

    async deleteExpense(expenseId) {
        await axiosClient.delete(
            `/expenses/${expenseId}`
        );
    },

    async getAllExpenses() {
        const groupsResponse = await axiosClient.get("/groups");

        const groups = groupsResponse.data || [];

        const expenseResults = await Promise.all(
            groups.map(async (group) => {
                const expenses = await this.getGroupExpenses(group.id);

                return expenses.map((expense) => ({
                    ...expense,
                    groupId: group.id,
                    groupName: group.name,
                }));
            })
        );

        return expenseResults.flat();
    },
};

export default expenseService;