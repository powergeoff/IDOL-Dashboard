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
        
        
        var random_boolean = Math.random() >= 0.5;

        return of(random_boolean);

        
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
