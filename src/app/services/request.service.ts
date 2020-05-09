import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';

import { IdolRequest } from '../models/request';
import { IdolResponse } from '../models/response';
import { PlatformService } from './platform.service';
import { Instance, PlatformModel } from '../models/platform';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class IdolRequestService{
    constructor(
        private http: HttpClient,
        private platformService: PlatformService
    ) { }

    getResponse(req: IdolRequest): Observable<IdolResponse>{
        // sandbox
        //let url = 'https://webappdev.partners.org/geoff/api/IDOLRequest';
        //2181
        let url = '/api/IDOLRequest';

        //use the env varibles for api urls https://angular.io/guide/build
        if (isDevMode()){
            url = 'http://localhost:62912/api/IDOLRequest';
        }

        let queryPort = this.platformService.getQueryPort(req.Instance);

        let searchParams: HttpParams;

        let print = 'parametric';

        if (req.PrintFields != '')
        {
            print = 'fields';
        }

        let fieldText = req.FieldText;

        if (req.UrlExists != '')
            fieldText = 'MATCH{' + req.UrlExists + '}:drereference'


        searchParams = new HttpParams({
            fromObject: {
                Text: req.Text = req.Text == '' ? '*': req.Text,
                Server: req.Server,
                Port: queryPort.toString(),
                DataBase: req.DataBase,
                FieldText: fieldText,
                PrintFields: req.PrintFields,
                Sort: req.Sort,
                Start: req.Start,
                End: req.End,
                Summary: 'context',
                Print: print
            }
        });
        
        return this.http.get<IdolResponse>(url, {
            params : searchParams
        });
    }
    
    getDataBases(server: string, instance: Instance): Observable<IdolResponse>{
        // sandbox
        //let url = 'https://webappdev.partners.org/geoff/api/IDOLRequest';
        //2181
        let url = '/api/IDOLRequest';

        if (isDevMode()){
            url = 'http://localhost:62912/api/IDOLRequest';
        }
        
        let queryPort = this.platformService.getQueryPort(instance);
        let searchParams = new HttpParams({
            fromObject: {
                Text: '*',
                Server: server,
                Port: queryPort.toString(),
                Summary: 'context'
            }
        });

        return this.http.get<IdolResponse>(url, {
            params : searchParams
        });
    }
}