import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PlatformModel, Instance, IdolComponent } from '../models/platform';

const httpOptions = {
    //, 'X-Forwarded-Proto' : 'https', 'X-Forwarded-Ssl': 'on', 'X-Url-Scheme': 'https'
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PlatformService {
    private url = "https://raw.githubusercontent.com/powergeoff/IDOL-Dashboard/master/src/app.config.json";
    constructor(
        private http: HttpClient
    ) { }

    isComponentLive(server = 'myserver2177', port = 8200): Observable<boolean> {
        
        //prod command
        //below is sandbox
        //let statusUrl = 'https://webappdev.partners.org/geoff/api/ComponentPing?server=' + server + '&port=' + port;
        //below is for 2181 installation
        let statusUrl = '/api/ComponentPing?server=' + server + '&port=' + port;

        if (isDevMode()){
            //statusUrl = 'http://' + server + ':' + port + '/action=GetPid&responseformat=json';
            statusUrl = 'http://localhost:62912/api/ComponentPing?server=' + server + '&port=' + port;
        }

        return this.http.get<boolean>(statusUrl);
        /* return this.http.get(statusUrl)
            .pipe(
                map(res => { return true }),
                catchError(res => { return of(false) })
            ); */
    }
    //: Observable<string>
    //if instance has a QMS port - return it
    //else use Content
    getQueryPort(instance: Instance): number {
        let retComponent = new IdolComponent;

        retComponent = instance.components.find(comp => comp.name === 'QMS');

        if (retComponent == null)
            retComponent = instance.components.find(comp => comp.name === 'Content');

        return retComponent.mainPort;
        
    }

    getServerFromEnvironment(env: string): string {
        let retEnv = new PlatformModel();

        this.getConfigByName(env).subscribe(
            data => {
                data = retEnv; 
            },
            error => {},
            () => {}
        );
        return retEnv.server;
    }

    getConfig(): Observable<PlatformModel[]> {
        return this.http.get<PlatformModel[]>(this.url);
    }
    getInstanceByName(env: PlatformModel, instanceName: string){

    }
    getConfigByName(env: string): Observable<PlatformModel>{
        return this.http.get<PlatformModel[]>(this.url)
            .pipe(
                map(res => res.find(server => server.environment === env))
            );
    }
    
}
