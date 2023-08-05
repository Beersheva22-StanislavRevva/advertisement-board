import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Adv from "../../model/Adv";
import advConfig from "../../config/adv-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
import Estate from "../../model/Estate";
import Vehicle from "../../model/Vehicle";
type Props = {
    submitFn: (adv: Adv) => Promise<InputResult>,
    closeFn: () => void,
    advFull: any
}

const initialVehicle:Vehicle = {
    brand: "",
    model: "",
    year: 0,
    color: "",
    milliage: 0
    
}

export const AdvVehicleForm: React.FC<Props> = ({ submitFn, closeFn, advFull}) => {

    if (Object.keys(advFull).includes('milliage')) {
        initialVehicle.brand = advFull.brand;
        initialVehicle.model = advFull.model;
        initialVehicle.year = advFull.year;
        initialVehicle.color = advFull.color;
        initialVehicle.milliage = advFull.milliage;
        delete advFull.brand;
        delete advFull.model;
        delete advFull.year;
        initialVehicle.color = advFull.color;
        initialVehicle.milliage = advFull.milliage;
    }

    const {minYear,maxYear,minMil,maxMil}
        = advConfig;
    const [errorMessage, setErrorMessage] = useState('');
    const [catFields,setCatFields] = useState<Vehicle>(initialVehicle); 
   
    function handlerBrand(event: any) {
        const brand = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.brand = brand;
        setCatFields(catFieldsCopy);
    }

    function handlerModel(event: any) {
        const model = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.model = model;
        setCatFields(catFieldsCopy);
    }
  
    function handlerYear(event: any) {
        const year: number = +event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.year = year;
        setCatFields(catFieldsCopy);
    }
    function handlerColor(event: any) {
        const color = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.color = color;
        setCatFields(catFieldsCopy);
    }
    function handlerMilliage(event: any) {
        const milliage: number = +event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.milliage = milliage;
        setCatFields(catFieldsCopy);
    }
    function getEstateString(catFields:Vehicle) {
    return JSON.stringify(catFields);
    }
    
    async function onSubmitFn(event: any) {
        event.preventDefault();
        advFull.catFields = getEstateString(catFields);
        const res =  await submitFn(advFull as Adv);
        res.status == "success" && event.target.reset();
        closeFn();
    }
    function onResetFn(event: any) {
        setCatFields(initialVehicle);
    }

    return <Box sx={{ marginTop: { sm: "5vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Manufacturer"
                        helperText="enter Manufacturer" onChange={handlerBrand}
                        value={catFields.brand} />
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Model"
                        helperText="enter Model" onChange={handlerModel}
                        value={catFields.model} />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="year" fullWidth required
                        type="number" onChange={handlerYear}
                        value={catFields.year || ''}
                        helperText={`enter year of manufacturing [${minYear}-${maxYear}]`}
                        inputProps={{
                            min: `${minYear}`,
                            max: `${maxYear}`
                        }} />
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Color"
                        helperText="enter Color" onChange={handlerColor}
                        value={catFields.color} />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="milliage" fullWidth required
                        type="number" onChange={handlerMilliage}
                        value={catFields.milliage || ''}
                        helperText={`enter milliage [${minMil}-${maxMil}]`}
                        inputProps={{
                            min: `${minMil}`,
                            max: `${maxMil}`
                        }} />
                </Grid>
            </Grid>

            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>



        </form>
       
    </Box>
}