import { Observable } from 'rxjs';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import { IRxHttpClient } from './IRxHttpClient';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { ParseClient } from '../../public/RxParseClient';

export class AxiosRxHttpClient implements IRxHttpClient {

    execute(httpRequest: HttpRequest): Observable<HttpResponse> {
        let tuple: [number, any] = [200, ''];
        return Observable.fromPromise(this.RxExecuteAxios(httpRequest)).map(res => {

            tuple[0] = res.status;
            tuple[1] = res.data;
            let response = new HttpResponse(tuple);
            return response;
        }).catch((err: any) => {
            ParseClient.printLog('Meta Error:', err);
            return Observable.throw(err);
        });
    }

    RxExecuteAxios(httpRequest: HttpRequest): Promise<AxiosResponse> {
        let method = httpRequest.method.toUpperCase();
        let useData = false;
        if (method == 'PUT' || 'POST') {
            useData = true;
        }
        return new Promise<AxiosResponse>((resolve, reject) => {
            axios({
                method: method,
                url: httpRequest.url,
                data: useData ? httpRequest.data : null,
                headers: httpRequest.headers
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });

    }

}