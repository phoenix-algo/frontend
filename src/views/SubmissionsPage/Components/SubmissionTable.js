import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import problemAPI from 'api/problem';
import avatarAPI from 'api/avatar';
import userAPI from 'api/user';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const SubmissionRow = ({ submission }) => {
  const [problem, setProblem] = useState({name: ""});
  const [user, setUser] = useState(undefined);

  const submissionDate = (time) => {
    const date = new Date(time);
    
    const year  = date.getFullYear();
    const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    const day   = date.getDay() < 10 ? "0" + date.getDay() : date.getDay();

    return day + "/" + month + "/" + year;
  }

  const submissionTime = (time) => {
    const date = new Date(time);
    
    const hour = date.getHours() < 10 ? "0" +  date.getHours() : date.getHours();
    const min  = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return hour + ":" + min;
  }

  const submissionStatus = (submission) => {
    if (submission.status == "waiting")
        return "Waiting";
    if(submission.status == "evaluating")
        return "Evaluating";
    if (submission.CompiledSuccesfully === false)
        return "Compilation Error";
    return `Evaluated: ${submission.Score}`
  }

  const fetchProblem = async () => {
    try {
      const problem = await problemAPI.getById(submission.problemId);
      if (problem == null || problem.length == 0)
        return;
      
      setProblem(problem[0]);
    } catch(err) {
      console.error(err)
    }
  }

  const fetchUser = async () => {
    try {
      const user = await userAPI.getById(submission.UserId);
      console.log(user);
      if (problem == null || problem.length == 0)
        return;

      setUser(user[0]);
    }catch(err) {
      console.log(err);
    }
  }
  
  useEffect(async() => {
    await Promise.all([fetchProblem(), fetchUser()]);
    console.log(user);
  }, []);

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <Link to={`/submissions/${submission.ID}`} style={{color: "black", textDecoration: "underline"}}>
          {submission.ID}
        </Link> 
      </StyledTableCell>
      <StyledTableCell>
      {user != undefined &&
            <a style={{color: "inherit", textDecoration: "underline"}} href={`/profile/${user.Username}`}>
                <img style={{borderRadius: "50%", width: "32px"}} src={user.UserIconURL} alt="user icon"/> {"  "}
                {user.Username} 
            </a>    
      } 
      </StyledTableCell>
      <StyledTableCell>
        {submissionDate(submission.CreatedAt)} 
        {"    "}
        {submissionTime(submission.CreatedAt)}
      </StyledTableCell>
      <StyledTableCell>
        {problem && problem.Name && 
        <Link to={`/problems/${problem.Name}`} style={{color: "black", textDecoration: "underline"}}>
          {problem.Name}
        </Link>
        }
      </StyledTableCell>
      <StyledTableCell align="right">
        {submissionStatus(submission)}
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default function SubmissionTable({ submissions }) {
  
    if (submissions.length === 0) {
      return <h3 style={{textAlign: "center"}}>No submission</h3>
    }

   return (
    <div>
      <p style={{fontSize: "28px"}}> {submissions.length} records </p>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Problem</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((row) => (
              <SubmissionRow key={row.id} submission={row}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

SubmissionTable.propTypes = {
    submissions: PropTypes.array.isRequired,
};