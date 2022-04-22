const userUtil = {
    storeUserData,
    clearUserData,
    getUserData,
}

function storeUserData(data) {
    localStorage.setItem("user", JSON.stringify(data));
}

function clearUserData() {
    localStorage.removeItem("user");
}

function getUserData() {
    return JSON.parse(localStorage.getItem("user"));
}

export default userUtil;