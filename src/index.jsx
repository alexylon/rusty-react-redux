import React, {useState} from "react";
import ReactDOM from "react-dom";
import {Box, TextField, Button, Stack} from '@mui/material';

const wasm = import("../build/rusty_react_redux");

wasm.then(m => {
    const App = (props) => {
        const [name, setName] = useState("");

        const store = m.Store.new();
        const dispatch = (actionType, action) => {
            store.dispatch(actionType, action);
            // this.setState(store.get_state())
        }

        const handleChange = (e) => {
            setName(e.target.value);
        }

        const handleAddName = () => {
            // const { dispatch } = props;
            dispatch(m.ActionType.AddName, name);
        }


        const [a, setA] = useState(0);
        const [b, setB] = useState(0);
        const [sum, setSum] = useState(0);
        const [stateSum, setStateSum] = useState(0);
        const [stateName, setStateName] = useState("");

        const handleClick = () => {
            m.welcome(name);
        }

        const handleChangeA = (e) => {
            setA(e.target.value);
        }
        const handleChangeB = (e) => {
            setB(e.target.value);
        }
        const handleSum = () => {
            let numbers = JSON.stringify({num1: a, num2: b});
            console.log(numbers);
            setSum(m.sum_two_ints(numbers));
        }
        const getSum = () => {
            setStateSum(m.get_sum());
        }
        const getNameNext = () => {
            setStateName(m.get_name_next());
        }
        const getNamePrevious = () => {
            setStateName(m.get_name_previous());
        }

        return (
            <Box
                component="form"
                noValidate
                autoComplete="off"
                marginLeft={5}
                marginTop={6}
            >
                <Box marginTop={6}>
                    <Box>
                        <TextField id="name" label="Name" variant="standard" onChange={(e) => handleChange(e)}/>
                    </Box>
                    <Box marginTop={2} marginBottom={6}>
                        <Button variant="contained" onClick={() => handleAddName()}>Add name</Button>
                    </Box>
                </Box>
                <Box marginTop={6}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => getNamePrevious()}>Get previous name</Button>
                        <Button variant="contained" onClick={() => getNameNext()}>Get next name</Button>
                        <h3>from Rust state: <span style={{color: "red"}}>{stateName}</span></h3>
                    </Stack>
                </Box>
                <Box marginTop={6}>
                    <Stack spacing={2} direction="row">
                        <TextField id="number1" label="Number 1" variant="standard"
                                   inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                                   onChange={(e) => handleChangeA(e)}/>
                        <TextField id="number2" label="Number 2" variant="standard"
                                   inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                                   onChange={(e) => handleChangeB(e)}/>
                        <Box>
                            <h3>Sum from Rust: {sum}</h3>
                        </Box>
                    </Stack>
                </Box>
                <Box marginTop={1}>
                    <Button variant="contained" onClick={() => handleSum()}>Sum numbers</Button>
                </Box>
                <Box marginTop={6}>
                    <Stack spacing={2} direction="row">
                        <Box marginTop={1}>
                            <Button variant="contained" onClick={() => getSum()}>Get sum</Button>
                        </Box>
                        <Box marginTop={0}>
                            <h3>from Rust state: <span style={{color: "red"}}>{stateSum}</span></h3>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        );
    };

    ReactDOM.render(<App/>, document.getElementById("root"));
});
