import Cookies from "js-cookie";
import base64 from "base-64";
import userAPI from "api/user";

const authenticationUtil = {
    getAuthToken,
    isUserLoggedIn,
    isUserAdmin,
    isUserProposer,
}

function getAuthToken() {
    const data = Cookies.get("auth-token");

    if (data == undefined)
        return null;

    return data
}

function isUserLoggedIn() {
    const authToken = getAuthToken();
    return authToken != null && authToken != "";
}

function isUserAdmin() {
    let user = userAPI.get
    if (!isUserLoggedIn())
        return false;

    const authToken = getAuthToken();
    return authToken?.user?.isAdmin == true;
}

function isUserProposer() {
    if (!isUserLoggedIn())
        return false;

    const authToken = getAuthToken();
    return (authToken?.user?.isAdmin === true || authToken?.user?.isProposer === true);
}

export default authenticationUtil;
