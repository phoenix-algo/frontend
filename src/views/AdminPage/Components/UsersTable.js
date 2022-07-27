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

export default function UsersTable() {
    const classes = useStyles();
    const [userId, setUserId] = useState(-1);
    const [rows, setRows] = useState([]);

    const filterUsers = (users, authedUserId) => {
        if (!users) users = [];
        return users.filter(user => user.ID !== authedUserId);
    }

    const generateUserURL = (user) => `/profile/${user.Username}`

    const updateUsers = (user, value) => {
        const users = rows.map(data => {
            if (data.ID !== user.ID)
                return data;

            const clone = Object.assign({}, data);
            clone.IsProposer = value;
            return clone; 
        });

        setRows(users);
    } 

    const assignProposer = async (user, value) => {
        try {
            await userAPI.assignProposerRole(user.Username, value);
            updateUsers(user, value);
            if(value)
                toast.success('role assinged succesfully', toastConfig);
            else 
                toast.success('role deleted succesfully', toastConfig);
        } catch(err) {
            console.error(err);
            if(value)
                toast.error('could not assign role', toastConfig);
            else 
                toast.error('could not delete role', toastConfig);
        }
    } 

    useEffect(() => {
        const id = util.getUserID();
        setUserId(id);
    });

    useEffect(async () => {
        if(userId == -1)
        return; 

        try {
        const users = await userAPI.getAll();
        setRows(filterUsers(users, userId));
        }catch(err) {
        // todo handle this case later!!!
        }

    }, [userId]);

  return (
    <>
      {rows.length === 0 &&
        <h3 style={{textAlign: "center", backgroundColor: "yellow"}}>No users yet yet!</h3>
      }
      { rows.length > 0 && 
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="right">Proposer</TableCell>
                <TableCell align="right">Admin</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.ID}>
                    <TableCell component="th" scope="row">
                        <Link to={generateUserURL(row)} className={classes.navLink} style={{color: "blue"}}>
                            {row.Username}
                        </Link>
                    </TableCell>
                    <TableCell align="left">
                       {row.Email}
                    </TableCell>
                    <TableCell align="right">
                       {row.IsProposer ? "true" : "false"}
                    </TableCell>
                    <TableCell align="right" >
                       {row.IsAdmin ? "true" : "false"}
                    </TableCell>
                    <TableCell align="right">
                        <Button onClick={() => assignProposer(row, !row.IsProposer)}  variant="contained" color={!row.IsProposer  ? "primary" : "secondary"}>
                            {row.IsProposer ? "delete proposer" : "assign proposer"}
                        </Button>
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