export function getApiErrorMessage(error, fallback) {

    if (!error) {
        return fallback;
    }

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.status === 403) {
        return "You do not have permission to perform this action.";
    }

    if (error.response?.status === 404) {
        return "The requested resource was not found.";
    }

    if (error.response?.status >= 500) {
        return "Something went wrong on the server. Please try again.";
    }

    if (error.request && !error.response) {
        return "Unable to connect to the server. Please check your connection.";
    }

    return fallback;
}