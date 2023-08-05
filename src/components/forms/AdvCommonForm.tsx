import React, { ReactNode, useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Adv from "../../model/Adv";
import advConfig from "../../config/adv-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
import { AdvEstateForm } from "./AdvEstateForm";
import { AdvVehicleForm } from "./AdvVehicleForm";
import { AdvElectronicsForm } from "./AdvElectronicsForm";
type Props = {
    submitFn: (adv: Adv) => Promise<InputResult>,
    advFullUpdated?: any

}
const initialAdv: Adv = {
    id: 0, name: '',category: '', price: 0, catFields:''
};
export const AdvCommonForm: React.FC<Props> = ({ submitFn, advFullUpdated}) => {
    const { minPrice, maxPrice, categories }
        = advConfig;
    let updFlag= false;
    advFullUpdated && (updFlag = true);
    const [adv, setAdv] =
        useState<any>(advFullUpdated || initialAdv);
        const [errorMessage, setErrorMessage] = useState('');
        const [categoryFormOpen, setCategoryFormOpen] = useState(false);
    
    function handlerName(event: any) {
        const name = event.target.value;
        const advCopy = { ...adv };
        advCopy.name = name;
        setAdv(advCopy);
    }
  
    function handlerPrice(event: any) {
        const price: number = +event.target.value;
        const advCopy = { ...adv };
        advCopy.price = price;
        setAdv(advCopy);
    }
    function handlerCategory(event: any) {
        const category = event.target.value;
        const advCopy = { ...adv };
        advCopy.category = category;
        setAdv(advCopy);
    }

    function categoryFormOpenFn ():ReactNode | String {
    let res:ReactNode | String = "";
    if (categoryFormOpen){
        const cat = adv.category;
        switch (cat) {
            case 'real estate':
                res = <AdvEstateForm submitFn={submitFn} closeFn={() => setCategoryFormOpen(false)} advFull={adv}/>;
                break;
            case 'vehicles':
                res = <AdvVehicleForm submitFn={submitFn} closeFn={() => setCategoryFormOpen(false)} advFull={adv}/>;
                break;
            case 'electronics':
                    res = <AdvElectronicsForm submitFn={submitFn} closeFn={() => setCategoryFormOpen(false)} advFull={adv}/>;
                    break;
        }
    }
    return res;
    }   

    async function onSubmitFn(event: any) {
        event.preventDefault();
        setCategoryFormOpen(true);
    }
    function onResetFn(event: any) {
        setAdv(initialAdv);
    }

    return <Box sx={{ marginTop: { sm: "5vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required disabled = {updFlag}>
                        <InputLabel id="select-category-id">Category</InputLabel>
                        <Select labelId="select-category-id" label="Category"
                            value={adv.category} onChange={handlerCategory}>
                            {categories.map(e => <MenuItem value={e} key={e}>{e}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Product name"
                        helperText="enter Product name" onChange={handlerName}
                        value={adv.name} />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="price" fullWidth required
                        type="number" onChange={handlerPrice}
                        value={adv.price || ''}
                        helperText={`enter price in range [${minPrice}-${maxPrice}]`}
                        inputProps={{
                            min: `${minPrice }`,
                            max: `${maxPrice }`
                        }} />
                </Grid>
            </Grid>

            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Next step</Button>
                <Button type="reset">Reset</Button>
            </Box>
        </form>
        {categoryFormOpenFn ()}
       
    </Box>
}