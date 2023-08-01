import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Adv from "../../model/Adv";
import advConfig from "../../config/adv-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
type Props = {
    submitFn: (adv: Adv) => Promise<InputResult>,
    advUpdated?: Adv

}
const initialAdv: Adv = {
    id: 0, name: '',category: '', price: 0, catFields:''
};
export const AdvCommonForm: React.FC<Props> = ({ submitFn, advUpdated}) => {
    const { minYear, minPrice, maxYear, maxPrice, categories }
        = advConfig;
    const [adv, setAdv] =
        useState<Adv>(advUpdated || initialAdv);
        const [errorMessage, setErrorMessage] = useState('');
    
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

    function handlerAddFields(event: any) {
        const catFields = event.target.value;
        const advCopy = { ...adv };
        advCopy.catFields = catFields;
        setAdv(advCopy);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res =  await submitFn(adv);
        res.status == "success" && event.target.reset();
    }
    function onResetFn(event: any) {
        setAdv(initialAdv);
    }

    return <Box sx={{ marginTop: { sm: "25vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
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
                <Grid item xs={8} sm={5} >
                    <TextField type="text"fullWidth label="Additional fields"
                        helperText="enter Additional field" onChange={handlerAddFields}
                        value={adv.catFields} />
                </Grid>
               
            </Grid>

            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>



        </form>
       
    </Box>
}