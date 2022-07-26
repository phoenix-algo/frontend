const userUtil = {
    storeUserData,
    clearUserData,
    getUserData,
    getUserID,
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

function getUserID() {
    const data = getUserData(); 

    if (data == null || data == undefined) 
        return -1;
    
    return data?.ID ? data.ID : -1;
}

export default userUtil;