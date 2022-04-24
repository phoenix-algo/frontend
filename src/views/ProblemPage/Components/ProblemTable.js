import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  gravatar: {
    borderRadius: "50%"
  }
});

export default function ProblemTable({ data }) {
  const classes = useStyles();

  return (
    // TODO add problem difficulty
    <TableContainer component={Paper} style={{marginBottom: "20px"}}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Posted by</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Time Limit</TableCell>
            <TableCell align="right">Memory Limit</TableCell>
            <TableCell align="right">Stack Limit</TableCell>
            <TableCell align="right">Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow key={data.ID}>
          {/* TODO avatar & username */}
            <TableCell component="th" scope="row">
              <Link to={() => `/profile/${data.AuthorId}`} style={{color: "blue"}}>
              <img src={"https://avatars.githubusercontent.com/u/43640455?s=96&v=4"} style={{width: "25px", borderRadius: "5px"}} alt="user icon"/> {"   "}
              marius004
              </Link>
            </TableCell>
            <TableCell align="right">{data.ID}</TableCell>
            <TableCell align="right">{data.TimeLimit} s</TableCell>
            <TableCell align="right">{data.MemoryLimit} KB</TableCell>
            <TableCell align="right">{data.StackLimit} KB</TableCell>
            <TableCell align="right">{data.Difficulty}</TableCell>
        </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ProblemTable.prototype = {
  data: PropTypes.object.isRequired
}