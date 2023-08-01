import { useDispatch } from "react-redux";
import CodePayload from "../model/CodePayload";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import Adv from "../model/Adv";
import { Subscription } from "rxjs";
import { employeesService } from "../config/service-config";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
       
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR :
                CodeType.UNKNOWN;
            message = error;
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}
export function useSelectorEmployees() {
    const dispatch = useDispatchCode();
    const [advs, setAdvs] = useState<Adv[]>([]);
    useEffect(() => {

        const subscription: Subscription = employeesService.getEmployees()
            .subscribe({
                next(advArray: Adv[] | string) {
                    let errorMessage: string = '';
                    if (typeof advArray === 'string') {
                        errorMessage = advArray;
                    } else {
                        setAdvs(advArray.map(e => ({ ...e})));
                    }
                    dispatch(errorMessage, '');

                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return advs;
}
