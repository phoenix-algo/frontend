import authenticationUtil from "./authentication";
import userUtil from "./user";

const problemUtil = {
  canUserEditProblem,
}

function canUserEditProblem(problem) {
    if(!authenticationUtil.isUserLoggedIn()) 
        return false;

    if(!problem) 
        return false;
    
    const user = userUtil.getUserData();
    return user != null && (user?.IsAdmin === true || (user?.ID !== null && user?.ID === problem?.AuthorId)); 
}

export default problemUtil;
