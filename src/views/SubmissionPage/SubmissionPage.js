import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import Navbar from "components/Navbar/Navbar";
import Grid from '@material-ui/core/Grid';

import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/views/components.js";
import classNames from "classnames";

import submissionAPI from "api/submission";
import avatarAPI from "api/avatar";
import submissionTestAPI from "api/submission-test";
import problemAPI from "api/problem";
import ProblemCard from "./Components/ProblemCard";
import SubmissionSourceCode from "./Components/SubmissionSourceCode";
import SubmissionStatus from "./Components/SubmissionStatus";

import Loading from "views/Components/Loading";
import NotFound from "views/Components/NotFound";
import InternalServerError from "views/Components/InternalServerError";
import userAPI from "api/user";

const useStyles = makeStyles(styles);

export default function SubmissionPage(props) {

    const [problem, setProblem] = useState({});
    const [author, setAuthor] = useState(undefined);
    const [submission, setSubmission] = useState({});
    const [submissionTests, setSubmissionTests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [fetchingStatus, setFetchingStatus] = useState(200);

    const classes = useStyles();
    const { submissionId } = useParams();  

    useEffect(async() => {
        try {
            const [submission, submissionTests] = await Promise.all([
                submissionAPI.getById(submissionId),
                submissionTestAPI.getBySubmissionId(submissionId)
            ]);

            setSubmission(submission);
            setSubmissionTests(submissionTests);

            const [problem, user] = await Promise.all([
                problemAPI.getById(submission.ProblemId),
                userAPI.getById(submission.UserId)
            ]);
           
            if (problem.length == 0) {
                setFetchingStatus(404);
                return;
            }

            if (user.length == 0) {
                setFetchingStatus(404);
                return;
            }

            setProblem(problem[0]);
            setAuthor(user[0]);
        } catch(err) {
            console.error(err);

            if (err?.message == "Network Error") {
                setFetchingStatus(500)
                return;
            }

            if (err?.response?.status === 404) {
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
    }, []);

    if (loading) {
        return <Loading/>
    }

    // 4xx (bad request or not found)
    if (Math.round(fetchingStatus / 100) == 4) {
        return <NotFound message="The submission you are looking for does not exist"/>   
    }

    // 5xx (internal server error)
    if (Math.round(fetchingStatus / 100) === 5) {
        return <InternalServerError/>
    }

    const authorProfile = () => {
        return `/profile/${author.Username}`
    }

    return (
        <div style={{marginBottom: "40px"}}>
            <Navbar color="white" fixed ={false}/> 
            <div style={{marginTop: "100px"}} className={classNames(classes.main, classes.mainRaised)}>
                <Grid container spacing={1} style={{padding: "12px"}}>
                    <Grid item xl={2} md={3} xs={12} style={{textAlign: "center"}}>
                        <h3>Submission #{submission.ID}</h3>
                        {author != undefined &&
                            <h3>Author: {"  "}
                                <a style={{color: "inherit", textDecoration: "underline"}} href={authorProfile()}>
                                    <img style={{borderRadius: "50%", width: "32px"}} src={author.UserIconURL} alt="user icon"/>
                                    {"   "}
                                    {author.Username} 
                                </a>    
                            </h3>
                        }
                        <h3>Score: {submission.Score}</h3>
                    </Grid>
                    <Grid item xl={10} md={9} xs={12}>
                        <ProblemCard 
                            problem={problem} 
                            submission={submission}
                        />
                        <SubmissionStatus
                            submission={submission}
                            submissionTests={submissionTests}
                        />
                        <SubmissionSourceCode 
                            problem={problem} 
                            submission={submission}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}