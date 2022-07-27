import React, {useState} from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import Navbar from 'components/Navbar/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import problemAPI from 'api/problem';
import { ToastContainer, toast } from 'react-toastify';
import WaitingForApprovalProblemsTable from './Components/WaitingForApprovalProblemsTable';
import UsersTable from './Components/UsersTable';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
}));

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

export default function AdminPage() {

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
        <CssBaseline/>
        <Navbar color="white" fixed ={false} />
        <Container style={{marginTop: "100px"}}>
            <h2 style={{textAlign: "center"}}>Manage Problems</h2>
            <WaitingForApprovalProblemsTable/>

            <h2 style={{textAlign: "center"}}>Manage Users</h2>
            <UsersTable/>
        </Container>
       </div>
   );
}