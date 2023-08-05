import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Adv from "../../model/Adv";
import advConfig from "../../config/adv-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
import Estate from "../../model/Estate";
import Vehicle from "../../model/Vehicle";
import Electronics from "../../model/Electronics";
type Props = {
    submitFn: (adv: Adv) => Promise<InputResult>,
    closeFn: () => void,
    advFull: any
}

const initialElectronics:Electronics = {
   electronicsType: "",
   model: "",
   condition: ""
}


export const AdvElectronicsForm: React.FC<Props> = ({ submitFn, closeFn, advFull}) => {
let updFlag = false;
    if (Object.keys(advFull).includes('electronicsType')) {
        updFlag = true;
        initialElectronics.electronicsType = advFull.electronicsType;
        initialElectronics.model = advFull.model;
        initialElectronics.condition = advFull.condition;
        delete advFull.electronicsType;
        delete advFull.model;
        delete advFull.condition;
    }

    const {electronicsTypes}
        = advConfig;
    const [errorMessage, setErrorMessage] = useState('');
    const [catFields,setCatFields] = useState<Electronics>(initialElectronics); 
   
    function handlerElectronicsType(event: any) {
        const type = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.electronicsType = type;
        setCatFields(catFieldsCopy);
    }

    function handlerModel(event: any) {
        const model = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.model = model;
        setCatFields(catFieldsCopy);
    }
  
    function handlerCondition(event: any) {
        setErrorMessage('');
        const condition: string = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.condition = condition;
        setCatFields(catFieldsCopy);
    }
  
    function getEstateString(catFields:Electronics) {
    return JSON.stringify(catFields);
    }
    
    async function onSubmitFn(event: any) {
        event.preventDefault();
        if (catFields.condition ==="") {
            setErrorMessage("Please select conditon") 
        }
        else{ 
            advFull.catFields = getEstateString(catFields);
            const res =  await submitFn(advFull as Adv);
            res.status == "success" && event.target.reset();
            closeFn();
        }
    }
    function onResetFn(event: any) {
        setCatFields(initialElectronics);
    }

    return <Box sx={{ marginTop: { sm: "5vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-type-id">Type</InputLabel>
                        <Select labelId="select-type-id" label="Category"
                            value={catFields.electronicsType || ''} onChange={handlerElectronicsType}>
                            {electronicsTypes.map(e => <MenuItem value={e} key={e}>{e}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Model"
                        helperText="enter Model" onChange={handlerModel}
                        value={catFields.model} />
                </Grid>
            
            <Grid item xs={8} sm={4} md={5}>
                    <FormControl required error={!!errorMessage}>
                        <FormLabel id="condition-group-label">Conditon</FormLabel>
                        <RadioGroup
                            aria-labelledby="condition-group-label"
                            defaultValue=""
                            value={catFields.condition || ''}
                            name="radio-buttons-group"
                           row onChange={handlerCondition}
                        >
                            <FormControlLabel value="new" control={<Radio />} label="New" disabled = {updFlag} />
                            <FormControlLabel value="used" control={<Radio />} label="Used" disabled = {updFlag}/>
                            <FormHelperText>{errorMessage}</FormHelperText>
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>
        </form>
    </Box>
}