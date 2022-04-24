import axios from "axios";
import config from "config";

const problemAPI = {
    getById,
    getAll,
    create,
    update,
    delete: deleteProblem,
};

function getById(problemId) {
    return axios.get(`${config.apiUrl}/problems/${problemId}`, config.cors)
        .then(res => res.data)
}

function getAll() {
    return axios.get(`${config.apiUrl}/problems`, config.cors)
        .then(res => res.data);
}

function create(problem) {
    return axios.post(`${config.apiUrl}/problems`, problem, 
        config.cors).then(res => res.data);
}

function update(problemId, data) {
    return axios.put(`${config.apiUrl}/problems/${problemId}`, data, 
        config.cors).then(res => res.data);
}

function deleteProblem(problemId) {
    return axios.delete(`${config.apiUrl}/problems/${problemId}`, 
        config.cors).then(res => res.data);
}

export default problemAPI;