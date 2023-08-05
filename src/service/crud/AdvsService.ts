import { Observable } from "rxjs";
import Adv from "../../model/Adv";

export default interface EmployeesService {
    addAdv(empl: Adv): Promise<Adv>;
    getAdvs(): Observable<Adv[] | string>;
    getAdvsByCat(category: String):any;
    deleteAdv(id: any): Promise<void>;
    updateAdv(empl: Adv): Promise<Adv>;
}