import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";

import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import authenticationUtil from "util/authentication";
import submissionAPI from "api/submission";
import util from "../../../util/util";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    container: {
        overflow: "auto",
        maxHeight: "420px",
        padding: "20px",
        border: "1px solid #bdbdbd"
    }
});

const ProblemSubmissions = ({ problem }) => {
    const [submissions, setSubmissions] = useState([])
    const classes = useStyles();

    const fetchSubmissions = async() => {
        if (!authenticationUtil.isUserLoggedIn()) return;
        const user = await authenticationUtil.getLoggedUser();

        try {
            const submissions = await submissionAPI.getByUserAndProblem(user.ID, problem.ID);  
            setSubmissions(submissions);
        } catch(err) {
            console.error(err);
        }
    }

    if (!authenticationUtil.isUserLoggedIn()) {
        return (
            <div className={classes.container}>
                <h1 style={{textAlign: "center"}}>You must be logged in to see your submissions!</h1>
            </div>
        );
    }

    useEffect(fetchSubmissions, []);

    if (submissions == null || submissions.length === 0) {
        return (
            <div className={classes.container}>
                <h3 style={{textAlign: "center"}}>No submission yet!</h3>
            </div>
        );
    }

    const submissionStatus = (submission) => {
        if (submission.Status == "waiting")
            return "Waiting";
        if(submission.Status == "evaluating")
            return "Evaluating";
        if (submission.CompiledSuccesfully === false)
            return "Compilation Error";
        if (submission.Score === 100)
            return "Accepted";
        return "Not accepted";
    }

    // https://materializecss.com/color.html
    const submissionRowColor = (submission) => {
        if(submission.Status == "working")
            return {backgroundColor: "#64b5f6"}

        if (submission.Status == "waiting")
            return {backgroundColor: "#dce775"}

        if (submission.Score == 0)
            return {backgroundColor: "#b71c1c"}; // red darken-4
        if (submission.Score <= 30)
            return {backgroundColor: "#d32f2f"}; // red darken-3
        if (submission.Score < 50)
            return {backgroundColor: "#ef5350"}; // red lighten-1
        
        if (submission.Score <= 60)
            return {backgroundColor: "#ff9800"}; // orange
        if (submission.Score <= 80)
            return {backgroundColor: "#ffa726"}; // orange lighten-2
        if (submission.Score < 100)
            return {backgroundColor: "#ffb74d"}; // orange lighten-4
        
        return {backgroundColor: "#388e3c"}; // green darken-2
    }

    const submissionScore = (submission) => {
        if(submission.Status == "evaluating" || submission.Status == "waiting")
            return "N/A";
        return submission.Score;
    }

    return (
        <div className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Time Submitted</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {submissions.map((row) => (
                        <TableRow key={row.ID} style={submissionRowColor(row)}>
                            <TableCell component="th" scope="row">
                                <Link to={`/submissions/${row.ID}`} 
                                    style={{color: "black", textDecoration: "underline"}}>
                                    {row.ID}
                                </Link> 
                            </TableCell>
                            <TableCell>
                                {util.formattedDate(row.CreatedAt)}
                                {"  "}
                                {util.formattedTime(row.CreatedAt)}
                            </TableCell>
                            <TableCell>{submissionStatus(row)}</TableCell>
                            <TableCell align="right">{submissionScore(row)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

ProblemSubmissions.prototype = {
    problem: PropTypes.object.isRequired
}  

export default ProblemSubmissions;