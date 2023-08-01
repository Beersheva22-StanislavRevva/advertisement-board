
import EmployeesServiceRest from "../service/crud/EmployeesServiceRest";
import EmployeesService from "../service/crud/EmployeesServiceRest";
const URL = "http://localhost:8080/sender/";

 export const employeesService: EmployeesService = 
    new EmployeesServiceRest(URL);