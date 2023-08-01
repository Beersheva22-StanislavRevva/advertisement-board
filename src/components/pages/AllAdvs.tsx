import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Box, Modal, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import Adv from '../../model/Adv';
import { employeesService } from '../../config/service-config';
import { useDispatchCode } from '../../hooks/hooks';
import { Confirmation } from '../common/Confirmation';
import AdvCard from '../cards/AdvCard';


   
   
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

const AllAdvs: React.FC = () => {

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
                        onClick={() => removeAdv(params.id)
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
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    const advs: Adv[] = [ // TODO insert useSelectorAdvs();
                        {id:'100000',name:'KIA Rio', category:'vehicles', price:20000, catFields:"aditional info"  },
                        {id:'100001',name:'Flat 4-rooms', category:'real estate', price:2000000, catFields:"aditional info"  },
                        {id:'100002',name:'iPhone 12 Pro ', category:'electronics', price:5000, catFields:"aditional info"  }
                        ]
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
       //TODO
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
        display: 'flex', justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={advs} />
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
                <AdvCard actionFn={cardAction}  adv = {advs.find(e => e.id === advId.current)!} />
            </Box>
        </Modal>

    </Box>
}
 
 export default AllAdvs;


