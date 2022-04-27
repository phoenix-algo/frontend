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
import userAPI from 'api/user';

const useStyles = makeStyles({
  gravatar: {
    borderRadius: "50%"
  }
});

export default function ProblemTable({ data }) {
  const classes = useStyles();
  const [author, setAuthor] = useState(undefined);

  const fetchUser = async() => {
    try {
      const user = await userAPI.getById(data.AuthorId);
      
      if (user.length === 0)
        return;
      
        setAuthor(user[0]);
    } catch(err) {
      console.log(err)
    }
  };

  useEffect(async() => {
    await fetchUser();
  }, []);

  return (
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
            <TableCell component="th" scope="row">
              {author != undefined && 
                <Link to={() => `/profile/${author.Username}`} style={{color: "blue"}}>
                    <img src={author.UserIconURL} style={{width: "25px", borderRadius: "5px"}} alt="user icon"/> {"   "}
                    {author.Username}
                </Link>
              }
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