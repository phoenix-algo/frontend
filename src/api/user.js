import axios from "axios";
import config from "../config";

const userAPI = {
    getByUsername,
    getById,
}

function getById(userId) {
    return axios.get(`${config.apiUrl}/users?userId=${userId}`, config.cors)
        .then(res => res.data);
}

function getByUsername(username) {
    return axios.get(`${config.apiUrl}/users/${username}`, config.cors)
        .then(res => res.data);
}

export default userAPI;