import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Adv from "../../model/Adv";
import advConfig from "../../config/adv-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
import Estate from "../../model/Estate";
type Props = {
    submitFn: (adv: Adv) => Promise<InputResult>,
    closeFn: () => void,
    adv: Adv

}
const initialAdv: Adv = {
    id: 0, name: '',category: '', price: 0, catFields:''
};
const initialEstate:Estate = {
    type: "", rooms:0, area: 0
}

export const AdvEstateForm: React.FC<Props> = ({ submitFn, closeFn, adv}) => {
    const {estateTypes, maxRooms, minRooms,minArea,maxArea}
        = advConfig;
    // const [adv, setAdv] =
    //     useState<Adv>(adv || initialAdv);
        const [errorMessage, setErrorMessage] = useState('');
    const [catFields,setCatFields] = useState<Estate>(initialEstate); 
    
    
    function handlerType(event: any) {
        const type = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.type = type;
        setCatFields(catFieldsCopy);
    }
  
    function handlerRooms(event: any) {
        const rooms: number = +event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.rooms = rooms;
        setCatFields(catFieldsCopy);
    }
    function handlerArea(event: any) {
        const area = event.target.value;
        const catFieldsCopy = { ...catFields};
        catFieldsCopy.area = area;
        setCatFields(catFieldsCopy);
    }
    
    async function onSubmitFn(event: any) {
        event.preventDefault();
        const catFieldsString = catFields.toString();
        adv.catFields = catFieldsString;
        const res =  await submitFn(adv);
        res.status == "success" && event.target.reset();
        closeFn();
    }
    function onResetFn(event: any) {
        setCatFields(initialEstate);
    }

    return <Box sx={{ marginTop: { sm: "5vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-type-id">Type</InputLabel>
                        <Select labelId="select-type-id" label="Category"
                            value={catFields.type||''} onChange={handlerType}>
                            {estateTypes.map(e => <MenuItem value={e} key={e}>{e}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="number of rooms" fullWidth required
                        type="number" onChange={handlerRooms}
                        value={catFields.rooms || ''}
                        helperText={`enter number of rooms in range [${minRooms}-${maxRooms}]`}
                        inputProps={{
                            min: `${minRooms}`,
                            max: `${maxRooms}`
                        }} />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="area" fullWidth required
                        type="number" onChange={handlerArea}
                        value={catFields.area || ''}
                        helperText={`enter square meters in range [${minArea}-${maxArea}]`}
                        inputProps={{
                            min: `${minArea}`,
                            max: `${maxArea}`
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