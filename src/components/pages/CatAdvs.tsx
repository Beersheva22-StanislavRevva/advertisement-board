import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Box, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import Adv from '../../model/Adv';
import { useDispatchCode, useSelectorAdvs } from '../../hooks/hooks';
import { Confirmation } from '../common/Confirmation';
import AdvCard from '../cards/AdvCard';
import Estate from '../../model/Estate';
import { advsService } from '../../config/service-config';
import { AdvCommonForm } from '../forms/AdvCommonForm';
import InputResult from '../../model/InputResult';
import advConfig from "../../config/adv-config.json"

const {categories}
        = advConfig;   
   
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CatAdvs: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'category', headerName: 'Category', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'price', headerName: 'Price', type: 'number', flex: 0.6, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="details" icon={<Visibility />}
                        onClick={() => {
                            advId.current = params.id as any;
                            if (params.row) {
                                const adv = params.row;
                                adv && (adv.current = adv);
                                setFlDetails(true)
                            }
    
                        }
                        } />,
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => 
                            removeAdv(params.id)
                        } />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => {
                            advId.current = params.id as any;
                            if (params.row) {
                                const adv = params.row;
                                adv && (adv.current = adv);
                                setFlEdit(true)
                            }
    
                        }
                        } />
                ] ;
            } 
        },
                
       ];
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const dispatch = useDispatchCode();
    const title = useRef('');
    const content = useRef('');
    const advId = useRef('');
    const confirmFn = useRef<any>(null);
    const adv = useRef<Adv | undefined>();
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    let advCur:Adv;
    const[currentCategory, setCurrentCategory] = useState('real estate');
    //let advs: Adv[];; //useSelectorAdvs().filter(e => e.category == currentCategory);
    
    const[advs, setAdvs] = useState<Adv[]>([]);
    let advsFull = getAdvsFull(advs);
    
    let handlerCategory = (event:any) => {
        let currentCategoryhandler = event.target.value;
        setCurrentCategory(currentCategoryhandler);
      }
    
    async function getAdvs() {
       const adverts = await advsService.getAdvsByCat(currentCategory);
       let intervalId: any;
       intervalId = setInterval(() => setAdvs(adverts), 3000);
       return () => clearInterval(intervalId);       
    }
    
    function getAdvsFull (advs: Adv[]) : any[] {                       
    let res: any[] = [];
    for(let i = 0; i < advs.length; i++) {
        res[i] = {...advs[i],...JSON.parse(advs[i].catFields)};
        delete res[i].catFields;
    }
    return res;
    }
        
    function removeAdv(id: any) {
         title.current = "Remove Advertisment?";
         const adv = advs.find(empl => empl.id == id);
         content.current = `You are going remove advertisment with id ${adv?.id}`;
        advId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
           try {
                await advsService.deleteAdv(advId.current);
           } catch (error: any) {
               errorMessage = error;
           }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }
    function updateAdv(adv: any): Promise<InputResult> {
        setFlEdit(false)
        const res: InputResult = { status: 'error', message: '' };
       if (JSON.stringify(advs.find(e => e.id == adv.id)) != JSON.stringify(adv)) {
            title.current = "Update Advertisment?";
            advCur = adv;
            content.current = `You are going update advertisment with id ${adv.id}`;
            confirmFn.current = actualUpdate;
            setOpenConfirm(true);
       }
        return Promise.resolve(res);
    }
    async function actualUpdate(isOk: boolean) {
        let successMessage: string = '';
        let errorMessage: string = '';
        if (isOk) {
            try {
                const advertisment: Adv = await advsService.updateAdv(advCur as Adv);
                successMessage = `advertisment with id: ${advertisment.id} has been updated`
            } catch (error: any) {
                errorMessage = error
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);

    }
    function cardAction(isDelete: boolean){
        if (isDelete) {
            removeAdv(advId.current);
        } else {
            setFlEdit(true)
        }
        setFlDetails(false)
    }
    return <Box sx={{
        display: 'flex', justifyContent: 'center', flexDirection:'column',
        alignContent: 'center'
    }}>
         <Grid container spacing={2} justifyContent="center" display="flex" flexDirection="row">
            <Grid item xs={4} sm={2} >
                <FormControl required fullWidth  >
                    <InputLabel id="select-unit-id">Category</InputLabel>
                    <Select labelId="select-unit-id" label="Status"
                       onChange={handlerCategory} value={currentCategory} >
                         {categories.map(e => <MenuItem value={e} key={e}>{e}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        <Box sx={{ height: '80vh', width: '95vw', marginTop: '4vh' }}>
            <DataGrid columns={columns} rows={advsFull} />
        </Box>
        <Confirmation confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        <Modal
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <AdvCard actionFn={cardAction}  advFull = {advsFull.find(e => e.id === advId.current)!} />
            </Box>
        </Modal>
        <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <AdvCommonForm submitFn={updateAdv} advFullUpdated={advsFull.find(e => e.id === advId.current)!} />
            </Box>
        </Modal>

    </Box>
}
 
 export default CatAdvs;


