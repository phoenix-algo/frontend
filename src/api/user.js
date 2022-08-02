import axios from "axios";
import config from "../config";

const userAPI = {
    getByUsername,
    getById,
    getAll, 
    getStats,
    assignProposerRole, 
    update,
}

function getById(userId) {
    return axios.get(`${config.apiUrl}/users?userId=${userId}`, config.cors)
        .then(res => res.data);
}

function getByUsername(username) {
    return axios.get(`${config.apiUrl}/users/${username}`, config.cors)
        .then(res => res.data);
}

function getAll() {
    return axios.get(`${config.apiUrl}/users`, config.cors)
        .then(res => res.data);
}

function getStats(username) {
    return axios.get(`${config.apiUrl}/users/${username}/stats`, config.cors)
        .then(res => res.data);
}

function update(data) {
    return axios.put(`${config.apiUrl}/users`, data, config.cors)
        .then(res => res.data);
}

function assignProposerRole(username, value) {
    return axios.post(`${config.apiUrl}/users/${username}/roles/proposer/${value}`, {}, config.cors)
        .then(res => res.data);
}

export default userAPI;