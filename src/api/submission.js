import axios from "axios";
import config from "config";

const submissionAPI = {
   getByQuery,
   getById,
   create,
   getByUserAndProblem,
};

function getByQuery(query, page) {
    const offset = page * config.submissionsLimit; 

    if (query == undefined || query == null || query == "")
        return axios.get(`${config.apiUrl}/submissions?limit=${config.submissionsLimit}&offset=${offset}`, config.cors)
            .then(res => res.data)

    return axios.get(`${config.apiUrl}/submissions?${query}&limit=${config.submissionsLimit}&offset=${offset}`, config.cors)
        .then(res => res.data)
}

function getById(id) {
    return axios.get(`${config.apiUrl}/submissions/${id}`, config.cors)
        .then(res => res.data)
}

// OK 
function getByUserAndProblem(user, problem) {
    return axios.get(`${config.apiUrl}/submissions?userId=${user.ID}&problemId=${problem.ID}`, config.cors)
        .then(res => res.data);
}

function create(sourceCode, language, problemId) {
    console.log({
        language: language,
        problemId: problemId,
        sourceCode: sourceCode,   
    })
    return axios.post(`${config.apiUrl}/submissions`, {
        language: language,
        problemId: problemId,
        sourceCode: sourceCode,
    }, config.cors)
        .then(res => res.data)
}

export default submissionAPI;