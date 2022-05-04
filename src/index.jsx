import React, {useState} from "react";
import ReactDOM from "react-dom";
import {Box, TextField, Button, Stack} from '@mui/material';

const wasm = import("../build/rusty_react_redux");

wasm.then(m => {
    const store = m.Store.new();
    const App = () => {
        const [name, setName] = useState("");
        // const {names} = m.get_state();
        // const [persons, setPersons] = useState(names);
        const [stateName, setStateName] = useState("");
        const [state, setState] = useState(m.get_state());

        const dispatch = (actionType, action) => {
            store.dispatch(actionType, action);
            setState(store.get_state())
        }

        const handleChange = (e) => {
            setName(e.target.value);
        }

        const handleAddName = () => {
            // const { dispatch } = props;
            dispatch(m.ActionType.AddName, {first_name: name});
            // setPersons(names);
        }

        const getNameNext = () => {
            setStateName(store.get_name_next());
        }
        const getNamePrevious = () => {
            setStateName(store.get_name_previous());
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
                    <h3>Rust state:</h3>
                    {state.names.map(name => <div>{name.id} {name.first_name}</div>)}
                </Box>
            </Box>
        );
    };

    ReactDOM.render(<App/>, document.getElementById("root"));
});
