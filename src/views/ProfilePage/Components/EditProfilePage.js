import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Navbar from "components/Navbar/Navbar";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import userUtil from "util/user";
import EditProfileTable from "./EditProfileForm";
import { ToastContainer } from "react-toastify";

const useStyles = makeStyles(styles);

export default function EditProfilePage() {
    const [user, setUser] = useState(null) 
    const classes = useStyles();

    const imageClasses = classNames(
        classes.imgRaised,
        classes.imgRoundedCircle,
        classes.imgFluid
    );

    const updateUser = (data) => {
        const userClone = Object.assign({}, user);

        userClone.WebsiteURL = data.webSiteURL
        userClone.LinkedInURL = data.linkedInURL
        userClone.GithubURL = data.githubURL
        userClone.UserIconURL = data.userIconURL
        userClone.Bio = data.bio 

        userUtil.storeUserData(userClone)
        setUser(userClone);
    }

    const getGravatarURI = () => {
        return user?.UserIconURL
    }

    useEffect(() => {
        const user = userUtil.getUserData();
        setUser(user);
    }, []);

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />
            <Navbar color="transparent" fixed ={false}/> 
            <Parallax
                small
                filter
                image={require("assets/img/profile-bg.jpg").default}
            />
            <div className={classNames(classes.main, classes.mainRaised)}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <div className={classes.profile}>
                            <img src={getGravatarURI()} alt="..." className={imageClasses} />
                        </div>
                    </GridItem>
                </GridContainer>
                <h2 style={{textAlign: "center", margin: "0"}}>Edit Profile</h2>
                {user != null && 
                    <div style={{width: "94%", margin: "auto"}}>
                        <EditProfileTable user={user} updateUser={updateUser} />
                    </div>
                }
            </div>
            <Footer />
        </div>
    );
}
