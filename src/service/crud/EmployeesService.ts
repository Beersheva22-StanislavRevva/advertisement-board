import { Observable } from "rxjs";
import Adv from "../../model/Adv";

export default interface EmployeesService {
    addEmployee(empl: Adv): Promise<Adv>;
    getEmployees(): Observable<Adv[] | string>;
    deleteEmployee(id: any): Promise<void>;
    updateEmployee(empl: Adv): Promise<Adv>;
}