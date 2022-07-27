import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import util from '../../../util/user';
import userAPI from 'api/user';
import problemAPI from 'api/problem';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const toastConfig = {
  fontSize: 30,
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
}

export default function ProposedProblemsTable() {
  const classes = useStyles();
  const [userId, setUserId] = useState(-1);
  const [rows, setRows] = useState([]);

  const deleteProblem = async (problem) => {
    if(confirm(`Are you sure you want to delete problem ${problem.Name}?`)) {
      try {
        await problemAPI.delete(problem.Name);
        removeProblems(problem);
        toast.success("Problem deleted successfully", toastConfig);
      } catch(err) {
        console.log(err);
        toast.error(`could not delete problem ${problem.Name}`, toastConfig);
      }
    }
  }

  const publishProblem = async (problem) => {
    if(confirm(`Are you sure you want to publish ${problem.Name}?`)) {
      try {
        const res = await problemAPI.publishProblem(problem.Name);
        updateProblems(problem, res.Status);
        toast.success(res.Message, toastConfig);
      }catch(err) {
        console.log(err);
        toast.error(`could not unpublish ${problem.Name}`, toastConfig);
      }
    }
  }

  const unpublishProblem = async (problem) => {
    if(confirm(`Are you sure you want to unpublish ${problem.Name}?`)) {
      try {
        const res = await problemAPI.unpublishProblem(problem.Name);
        updateProblems(problem, res.Status);
        toast.success(res.Message, toastConfig);
      }catch(err) {
        console.log(err);
        toast.error(`could not unpublish ${problem.Name}`, toastConfig);
      }
    }
  }

  const updateProblems = (problem, status) => {
    const problems = rows.map((data) => {
      if(data.ID !== problem.ID)
        return data;
      
      const clone = Object.assign({}, data);
      clone.Status = status;
      return clone; 
    });

    problems.sort((a, b) => -1 * (a.Status > b.Status))

    setRows(problems);
  }

  const removeProblems = (problem) => {
    const problems = rows.filter((data) => {
      return data.ID !== problem.ID;
    });

    problems.sort((a, b) => -1 * (a.Status > b.Status))

    setRows(problems);
  }

  const generateProblemURL = (problem) => {
    return `/problems/${problem.Name}`;
  }

  const isProblemPublished = (status) => {
    return status === "published";
  }

  const isProblemUnpublished = (status) => {
    return status === "unpublished";
  }

  const isProblemWaitingForApproval = (status) => {
    return status === "waiting for approval";
  }

  useEffect(() => {
    const id = util.getUserID();
    setUserId(id);
  });

  useEffect(async () => {
    if(userId == -1)
      return; 

    try {
      const problems = await problemAPI.getAll();
      if(problems) problems.sort((a, b) => -1 * (a.Status > b.Status))
      setRows(problems ? problems : []);
    }catch(err) {
      // todo handle this case later!!!
    }

  }, [userId]);

  return (
    <>
      {rows.length === 0 &&
        <h3 style={{textAlign: "center", backgroundColor: "yellow"}}>You have not proposed any problems yet!</h3>
      }
      { rows.length > 0 && 
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Time Limit</TableCell>
                <TableCell align="right">Memory Limit</TableCell>
                <TableCell align="right">Stack Limit</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.ID}>
                  <TableCell component="th" scope="row">
                    <Link to={generateProblemURL(row)} className={classes.navLink} style={{color: "blue"}}>
                      {row.Name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {row.TimeLimit} {"s"} 
                  </TableCell>
                  <TableCell align="right">
                    {row.MemoryLimit} {"KB"}
                  </TableCell>
                  <TableCell align="right">
                    {row.StackLimit} {"KB"}
                  </TableCell>
                  <TableCell align="right">
                    {row.Status}
                  </TableCell>
                  <TableCell align="right">
                      {(isProblemUnpublished(row.Status)|| isProblemWaitingForApproval(row.Status)) && 
                        <Button onClick={() => publishProblem(row)}  variant="contained" color="primary">publish</Button>
                      } {" "}
                      {isProblemPublished(row.Status) && 
                        <Button onClick={() => unpublishProblem(row)} variant="contained" color="primary">unpublish</Button>
                      } {" "}
                      <Button onClick={() => deleteProblem(row)} variant="contained" color="secondary">delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}