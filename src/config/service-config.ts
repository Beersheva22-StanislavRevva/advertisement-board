
import AdvsServiceRest from "../service/crud/AdvsServiceRest";
import AdvsService from "../service/crud/AdvsService";
const URL = "http://localhost:8080/advboard";

 export const advsService: AdvsService = 
    new AdvsServiceRest(URL);