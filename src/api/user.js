import axios from "axios";
import config from "../config";

const userAPI = {
    getByUsername,
    storeUserData,
    getUserData, 
    clearUserData, 
}

function getByUsername(username) {
    return axios.get(`${config.apiUrl}/users/${username}`, config.cors)
        .then(res => res.data);
}

// TODO MOVE TO UTIL.
function storeUserData(data) {
    localStorage.setItem("user", JSON.stringify(data));
}

function clearUserData() {
    localStorage.removeItem("user");
}

function getUserData() {
    return JSON.parse(localStorage.getItem("user"));
}

export default userAPI;