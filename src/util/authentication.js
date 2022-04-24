import Cookies from "js-cookie";
import userUtil from "./user";

const authenticationUtil = {
    isUserLoggedIn,
    isUserAdmin,
    isUserProposer,
    getLoggedUser,
    getAuthToken,
}

// TODO do not export this function 
function getAuthToken() {
    const data = Cookies.get("auth-token");
    return data == undefined ? null : data;
}

function isUserLoggedIn() {
    const authToken = getAuthToken();
    return authToken != null && authToken != "";
}

function isUserAdmin() {
    if (!isUserLoggedIn())
        return false; 

    let user = userUtil.getUserData();
    return user?.IsAdmin === true;
}

function isUserProposer() {
    if (!isUserLoggedIn())
        return false;

    let user = userUtil.getUserData();
    return user?.IsAdmin === true || user?.IsProposer === true;
}

function getLoggedUser() {
    if (!isUserLoggedIn())
        return null;
            
    let user = userUtil.getUserData();
    return user;
}

export default authenticationUtil;
