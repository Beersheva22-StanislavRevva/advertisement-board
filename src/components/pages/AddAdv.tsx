import Adv from "../../model/Adv";
import {AdvCommonForm } from "../forms/AdvCommonForm";
import InputResult from "../../model/InputResult";
import { advsService } from "../../config/service-config";

import { useDispatchCode } from "../../hooks/hooks";


const AddAdv: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    async function submitFn(adv: Adv): Promise<InputResult> {
        
        const res: InputResult = {status: 'success', message: ''};
        try {
            const advertisment: Adv = await advsService.addAdv(adv);
            successMessage = `advertisment with id: ${advertisment.id} has been added`
        } catch (error: any) {
           errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }
    
    return <AdvCommonForm submitFn={submitFn}/>
}
export default AddAdv;