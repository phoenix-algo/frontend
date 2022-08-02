import React, {useState, useEffect} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Navbar from "components/Navbar/Navbar";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import userAPI from "api/user";

import Loading from "views/Components/Loading";
import InternalServerError from "views/Components/InternalServerError";
import NotFound from "views/Components/NotFound";

import Email from "@material-ui/icons/Email";
import { Web } from "@material-ui/icons";
import { LinkedIn } from "@material-ui/icons";
import GitHub from "@material-ui/icons/GitHub";
import userUtil from "util/user";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function ProfilePage() {
    const {username} = useParams();
    const history = useHistory();

    const [user, setUser] = useState({})
    const [stats, setStats] = useState(null);

    const classes = useStyles();

    const imageClasses = classNames(
        classes.imgRaised,
        classes.imgRoundedCircle,
        classes.imgFluid
    );

    const [loading, setLoading] = useState(true);
    const [fetchingStatus, setFetchingStatus] = useState(200);

    const fetchUser = async() => {
        try {
            const user = await userAPI.getByUsername(username);
            setUser(user);
        } catch(err) {
            console.error(err);

            if (err.message == "Network Error") {
                setFetchingStatus(500)
                return;
            }

            if (err.response.status === 404) {
                setFetchingStatus(404);
                return;
            }

            if (err?.response?.status) {
                setFetchingStatus(err.response.status);
                return;
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchStats = async () => {
        try {
            const stats = await userAPI.getStats(username);
            setStats(stats);
        } catch(err) {
            console.error(err);

            if (err.message == "Network Error") {
                setFetchingStatus(500)
                return;
            }

            if (err.response.status === 404) {
                setFetchingStatus(404);
                return;
            }

            if (err?.response?.status) {
                setFetchingStatus(err.response.status);
                return;
            }
        }
    }

    const showEditProfileButton = () => username === user?.Username
    const redirectToProfileEditPage = () => history.push("/profile-edit")

    const getGravatarURI = () => {
        return user.UserIconURL
    }

    useEffect(fetchUser, []);
    useEffect(fetchStats, []);

    if (loading) {
        return <Loading/>
    }

    // 4xx (bad request or not found)
    if (Math.round(fetchingStatus / 100) == 4) {
        return <NotFound message="Problema cautata nu a fost gasita"/>   
    }

    // 5xx (internal server error)
    if (Math.round(fetchingStatus / 100) === 5) {
        return <InternalServerError/>
    }

    return (
        <div>
        <Navbar color="transparent" fixed ={false}/> 
        <Parallax
            small
            filter
            image={require("assets/img/profile-bg.jpg").default}
        />
        <div className={classNames(classes.main, classes.mainRaised)}>
            <div>
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <div className={classes.profile}>
                            <img src={getGravatarURI()} alt="..." className={imageClasses} />
                        </div>
                    </GridItem>
                </GridContainer>

                <GridContainer style={{padding: "12px 16px", position: "relative", top: "-60px"}}>
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        style={{width: "98%", margin: "0 auto 12px auto", backgroundColor: "orange"}}
                        onClick={redirectToProfileEditPage}
                    >
                        Edit
                    </Button>
                    <GridItem xs={8} sm={8} md={8}>
                        <p style={{fontWeight: "bold", margin: 0, padding: 0}}>
                            {user.Bio}
                        </p> <br/>

                        <Email/> 
                        <span style={{position: "relative", top: "-6px", left: "6px"}}>
                            <a style={{color: "blue"}} href={"mailto:" + user.Email}>{user.Email}</a>
                        </span> <br/>

                        {user.WebsiteURL != "" &&
                            <>
                                <Web/>
                                <span style={{position: "relative", top: "-6px", left: "6px"}}>
                                    <a target="_blank" style={{color: "blue"}} href={user.WebsiteURL}>{user.WebsiteURL}</a>
                                </span> <br/>
                            </>
                        }

                        {user.LinkedInURL != "" &&
                            <>
                                <LinkedIn/>
                                <span style={{position: "relative", top: "-6px", left: "6px"}}>
                                    <a target="_blank" style={{color: "blue"}} href={user.LinkedInURL}>{user.LinkedInURL}</a>
                                </span> <br/>
                            </>
                        }

                        {user.GithubURL != "" &&
                            <>
                                <GitHub/>
                                <span style={{position: "relative", top: "-6px", left: "6px"}}>
                                    <a target="_blank" style={{color: "blue"}} href={user.GithubURL}>{user.GithubURL}</a>
                                </span> <br/>
                            </>
                        }
                    </GridItem>

                    <GridItem xs={4} sm={4} md={4}>
                        {stats && 
                            <>
                                {stats.ProblemCount != 1 && 
                                     <h4>{stats.ProblemCount} problems solved</h4>
                                } 
                                {stats.ProblemCount == 1 && 
                                    <h4>{stats.ProblemCount} problem solved</h4>
                                }
                                {
                                    stats.Problems.map(problem => {
                                       return <Link to={`/problems/${problem.Name}`}> 
                                            {problem.Name} {" "}
                                        </Link>
                                    })
                                }
                            </>
                        }
                    </GridItem>

                </GridContainer>
            </div>
            </div>
        </div>
        <Footer />
        </div>
    );
}
