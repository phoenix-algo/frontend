import axios from "axios";
import config from "config";

const problemAPI = {
    getByName,
    getAll,
    create,
    update,
    delete: deleteProblem,
};

function getByName(problemName) {
    return axios.get(`${config.apiUrl}/problems/${problemName}`, config.cors)
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

function update(problemName, data) {
    return axios.put(`${config.apiUrl}/problems/${problemName}`, data, 
        config.cors).then(res => res.data);
}

function deleteProblem(problemName) {
    return axios.delete(`${config.apiUrl}/problems/${problemName}`, 
        config.cors).then(res => res.data);
}

export default problemAPI;