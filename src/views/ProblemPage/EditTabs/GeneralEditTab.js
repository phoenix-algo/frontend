import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import problemAPI from "api/problem";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from "react-router";
import { Box } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select } from '@material-ui/core';

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
};


export default function GeneralEditTab({problem, setProblem}) {
    const classes = useStyles();
    const history = useHistory();

    const [difficulty, setDifficulty] = useState(problem.Difficulty);
    const [memoryLimit, setMemoryLimit] = useState(problem.MemoryLimit);
    const [stackLimit, setStackLimit] = useState(problem.StackLimit);
    const [timeLimit, setTimeLimit] = useState(problem.TimeLimit);

    const onMemoryLimitChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 131072)
            setMemoryLimit(value);
    }

    const onStackLimitChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 131072)
            setStackLimit(value);
    }

    const onTimeLimitChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 10)
            setTimeLimit(value);
    }

    const handleProblemUpdate = async() => {
        try {
            await problemAPI.update(problem.ID, {
                difficulty: difficulty,
                timeLimit: parseFloat(timeLimit),
                memoryLimit: parseFloat(memoryLimit),
                stackLimit: parseFloat(stackLimit), 
            });

            setProblem({
                ...problem,
                TimeLimit: timeLimit, 
                MemoryLimit: memoryLimit,
                StackLimit: stackLimit,
                Difficulty: difficulty
            });

            toast.success("Problem updated successfully!", toastConfig);
        } catch(err) {
            console.error(err);
            const message = err?.response?.data?.message;

            if (message != null)
                toast.error(`Could not update problem: ${message}`, toastConfig);
            else
                toast.error("Could not update problem", toastConfig);
        }
    };

    const handleDeleteProblem = async () => {
        if (confirm("Are you sure you want to delete this problem?")) {
            try {
                await problemAPI.delete(problem.ID);
                toast.success(`Problem ${problem.Name} deleted! Redirecting you to the problems page!`, toastConfig);
                
                setTimeout(() => {
                    history.push("/problems");
                }, 2000);
            } catch(err) {
                console.error(err);
                const message = err?.response?.data;

                if (message != null)
                    toast.error(`Could not delete problem: ${message}`, toastConfig);
                else
                    toast.error("Could not delete problem", toastConfig);
            }
        }
    };

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
            <div style={{border: "1px solid #01579b", padding: "4px", marginBottom: "20px"}} className={classes.root}>
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
            <Box style={{margin: "12px",width: "98.5%"}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
                    <Select
                        labelId="difficulty"
                        id="difficulty"
                        value={difficulty}
                        label="difficulty"
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <MenuItem value={"easy"}>{"easy"}</MenuItem>
                        <MenuItem value={"medium"}>{"medium"}</MenuItem>
                        <MenuItem value={"hard"}>{"hard"}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
                <TextField
                    value={memoryLimit}
                    onChange={onMemoryLimitChange}
                    type="number"
                    id="outlined-secondary"
                    label="Memory Limit(KB)"
                    variant="outlined"
                    color="secondary"
                    style={{width: "99%"}}
                />
                <TextField
                    value={stackLimit}
                    onChange={onStackLimitChange}
                    type="number"
                    id="outlined-secondary"
                    label="Stack Limit(KB)"
                    variant="outlined"
                    color="secondary"
                    style={{width: "99%"}}
                />
                <TextField
                    value={timeLimit}
                    onChange={onTimeLimitChange}
                    type="number"
                    id="outlined-secondary"
                    label="Time Limit(seconds)"
                    variant="outlined"
                    color="secondary"
                    style={{width: "99%"}}
                />
                <br/>
                <Button onClick={handleProblemUpdate} type="submit" variant="contained" color="primary" >
                    Update
                </Button>
                <Button onClick={handleDeleteProblem} type="submit" variant="contained" style={{backgroundColor: "#d50000", color: "white"}} >
                    Delete Problem
                </Button>
            </div>
        </div>
    );
}