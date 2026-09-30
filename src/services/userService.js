import axiosClient from "../api/axiosClient";

const userService = {

    async getCurrentUser() {

        const response =
            await axiosClient.get("/users/me");

        return response.data;
    },
};

export default userService;