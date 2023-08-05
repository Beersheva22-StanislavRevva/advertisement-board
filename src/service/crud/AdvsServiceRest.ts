import { Observable, Subscriber } from "rxjs";
import Adv from "../../model/Adv";
import AdvsService from "./AdvsService";
import { getRandomInt } from "../../util/random";
const MIN_ID = 100000;
const MAX_ID = 1000000;
const POLLER_INTERVAL = 3000;

class Cache {
    cacheString: string = '';
    set(advs: Adv[]): void {
        this.cacheString = JSON.stringify(advs);
    }
    reset() {
        this.cacheString = ''
    }
    isEqual(advs: Adv[]): boolean {
        return this.cacheString === JSON.stringify(advs)
    }
    getCache(): Adv[] {
        return !this.isEmpty() ? JSON.parse(this.cacheString) : []
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
}
function convertAdv(adv: Adv, id?: string): any {
    const res: any = { ...adv, id: id ? id : adv.id};
    return res;
}
function getResponseText(response: Response): string {
    let res = '';
    if (!response.ok) {
        const { status, statusText } = response;
        res = status == 401 || status == 403 ? 'Authentication' : statusText;
    }
    return res;

}
function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json'
        }
    return res;
}
async function fetchRequest(url: string, options: RequestInit, adv?: Adv): Promise<Response> {
    options.headers = getHeaders();
    if (adv) {
        options.body = JSON.stringify(adv);
    }

    let flUpdate = true;
    let responseText = '';
    try {
        if (options.method == "DELETE" || options.method == "PUT") {
            flUpdate = false;
            await fetchRequest(url, {method: "GET"});
            flUpdate = true;
        }
        const response = await fetch(url, options);
        responseText = getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : "Server is unavailable. Repeat later on";
    }
}
async function fetchAllAdvs(url: string):Promise< Adv[]|string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class AdvsServiceRest implements AdvsService {
    private observable: Observable<Adv[] | string> | null = null;
    private observableCat: Observable<Adv[] | string> | null = null;
    private cache: Cache = new Cache();
    private cacheCat: Cache = new Cache();
    constructor(private url: string) { }
   
    private getUrlWithId(id: any): string {
        return `${this.url}/${id}`;
    }
    private sibscriberNext(url: string, subscriber: Subscriber<Adv[] | string>): void {
        
        fetchAllAdvs(url).then(advs => {
            if (this.cache.isEmpty() || !this.cache.isEqual(advs as Adv[])) {
                this.cache.set(advs as Adv[]);
                subscriber.next(advs);
            }
            
        })
        .catch(error => subscriber.next(error));
    }
    async deleteAdv(id: any): Promise<void> {
            const response = await fetchRequest(this.getUrlWithId(id), {
                method: 'DELETE',
            });
            
    }
    async updateAdv(adv: Adv): Promise<Adv> {
        const response = await fetchRequest(this.getUrlWithId(adv.id!),
            { method: 'PUT' }, adv);

        return await response.json();

    }
    getAdvs(): Observable<Adv[] | string> {
        let intervalId: any;
        if (!this.observable) {
            this.observable = new Observable<Adv[] | string>(subscriber => {
                this.cache.reset();
                this.sibscriberNext(this.url, subscriber);
                intervalId = setInterval(() => this.sibscriberNext(this.url, subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observable;
    }
    
    async getAdvsByCat(category: String) {
        const requestUrl = this.url + "/category/" + category;
        const response = await fetchRequest(requestUrl,{});
        
        return response.json();
    }

    async getAdvsByPrice(price: number) {
        if (price > 0) {
        const requestUrl = `${this.url}/price/${price}`;
        const response = await fetchRequest(requestUrl,{});
        return response.json();}
    }
    
    async addAdv(adv: Adv): Promise<Adv> {
        const id: string = await this.getId();
        const advertisment = convertAdv(adv, id);
            const response = await fetchRequest(this.url, {
                method: 'POST',
               }, {...advertisment} as any)
           ;
           return response.json();

    }
    private async getId(): Promise<string> {
        let id: string = '';
        //TODO
        //do {
            id = getRandomInt(MIN_ID, MAX_ID).toString();
        //} while (await this.exists(id));
        return id;
    }

    getCat(category: String): Observable<Adv[] | string> {
        const requestUrl = this.url + "/category/" + category;
        let intervalId: any;
        if (!this.observableCat) {
            this.observableCat = new Observable<Adv[] | string>(subscriber => {
                this.cacheCat.reset();
                this.sibscriberCatNext(requestUrl, subscriber);
                intervalId = setInterval(() => this.sibscriberCatNext(requestUrl, subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observableCat;
    }
     private sibscriberCatNext(url: string, subscriber: Subscriber<Adv[] | string>): void {
        
        fetchAllAdvs(url).then(advs => {
            if (this.cacheCat.isEmpty() || !this.cacheCat.isEqual(advs as Adv[])) {
                this.cacheCat.set(advs as Adv[]);
                subscriber.next(advs);
            }
            
        })
        .catch(error => subscriber.next(error));
    }
    

}