import { Select } from '@material-ui/core';
import testAPI from 'api/problem-test';
import React, {useEffect, useState} from 'react';
import { MenuItem } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { TextField } from "@material-ui/core";
import util from "../../../util/util";

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

export default function UpdateTests({problem}) {
    const [tests, setTests] = useState([]);
    const [test, setTest] = useState({});

    const [testId, setTestId] = useState(-1);
    const [score, setScore] = useState(0)
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const fetchProblemTests = async() => {
        const tests = await testAPI.getProblemTests(problem.Name);
        setTests(tests);
    };

    const onScoreChange = (e) => {
        const value = parseInt(e.target.value);

        if (value > 0 && value <= 100)
            setScore(value);
    }

    const handleTestIdChange = async() => { 
        if(testId === -1) {
            setTest({});
            return;
        }

        const test = await testAPI.getProblemTestById(problem.Name, testId);
        setTest(test);

        setScore(test.Score);
        setInput(util.decodeBase64String(test.Input))
        setOutput(util.decodeBase64String(test.Output))
    };

    const handleTestUpdate = async() => {
        try {
            await testAPI.updateProblemTestById(problem.Name, testId, score, input, output);
            toast.success("Test updated successfully!", toastConfig);
        } catch(err) {
            console.error(err);
            const message = err?.response?.data;

            if (message != null)
                toast.error(`Test update failed: ${message}`, toastConfig);
            else
                toast.error("Test update failed", toastConfig);
        }
    };

    const removeTest = (testId) => {
        let list = [...tests];
        list = list.filter(test => test.ID != testId);
        setTests(list);
    };

    const handleDeleteTest = async() => {
        if (confirm("Are you sure you want to delete this test?")) {
            try {
                await testAPI.deleteProblemTestById(problem.Name, testId);
                toast.success(`Test ${testId} deleted!`, toastConfig);
                removeTest(testId);
                setTestId(-1);
            } catch(err) {
                console.error(err);
                const message = err?.response?.data;

                if (message != null)
                    toast.error(`Could not delete test: ${message}`, toastConfig);
                else
                    toast.error("Could not delete test", toastConfig);
            }
        }
    };

    useEffect(fetchProblemTests, []);
    useEffect(handleTestIdChange, [testId]);

    return (
        <div style={{marginBottom: "20px"}}>
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
            <Box sx={{ minWidth: 120 }} style={{marginBottom: "16px"}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Test Id</InputLabel>
                    <Select
                        labelId="test-id"
                        id="test-id"
                        value={testId}
                        label="test-id"
                        onChange={(e) => setTestId(e.target.value)}
                    >
                        <MenuItem value={-1}>-</MenuItem>
                        {
                            tests.map((test) => {
                            return <MenuItem key={test.ID} value={test.ID}>{test.ID}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box>

            {testId !== -1 &&
                <>
                    <TextField
                        value={score}
                        onChange={onScoreChange}
                        type="number"
                        id="outlined-secondary"
                        label="Score"
                        variant="outlined"
                        color="secondary"
                        style={{width: "100%", marginBottom: "10px"}}
                    />

                    <h4>Input: </h4>
                    <textarea 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        style={{resize: "none", width: "100%", minHeight: "200px"}}
                    />

                    <h4>Output: </h4>
                    <textarea 
                        value={output}
                        onChange={e => setOutput(e.target.value)}
                        style={{resize: "none", width: "100%", minHeight: "200px"}}
                    />

                    <Button onClick={handleTestUpdate} type="submit" variant="contained" color="primary" style={{marginRight: "2px"}} >
                        Update
                    </Button>

                    <Button onClick={handleDeleteTest} type="submit" variant="contained" style={{backgroundColor: "#d50000", color: "white"}}>
                        Delete
                    </Button>
                </>
            }
        </div>
    );
}