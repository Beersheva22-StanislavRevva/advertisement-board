import Adv from "../../model/Adv";
import {AdvCommonForm } from "../forms/AdvCommonForm";
import InputResult from "../../model/InputResult";
import { employeesService } from "../../config/service-config";

import { useDispatchCode } from "../../hooks/hooks";


const AddAdv: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    async function submitFn(adv: Adv): Promise<InputResult> {
        console.log(adv);
        
        const res: InputResult = {status: 'success', message: ''};
        // TODO
        dispatch(errorMessage, successMessage);
        return res;
    }
    
    return <AdvCommonForm submitFn={submitFn}/>
}
export default AddAdv;