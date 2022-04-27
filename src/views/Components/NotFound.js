import Navbar from "components/Navbar/Navbar";
import React from "react";

const NotFound = ({message}) => {
    return (<>
        <Navbar color = "white" fixed ={false}/> 
        <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <img width="470px"  src={require("assets/img/404.png").default}/> 
            <h3>{message ? message : "The page you are looking for does not exist"}</h3>
        </div> 
    </>);
};

export default NotFound;