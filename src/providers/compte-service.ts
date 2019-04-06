import { Injectable } from '@angular/core';
import { Http ,  Headers} from '@angular/http';
import { AuthService} from './auth-service';
import {AppNotify} from '../app/app-notify';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Events } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

@Injectable()
export class CompteService {
    headers:Headers;
    baseUrl:string;
    static localData:any ;
    constructor(public http: Http,
    public authservice: AuthService,
    public events: Events,
    public appNotify: AppNotify,
    public translateService: TranslateService
    ) {
    this.headers =  authservice.getHeader() ;
    this.baseUrl=authservice.baseUrl;
  }

  /*Recherche la date de derniere mise a jour*/
  getAbonnement(uid: any) {
      console.log(this.baseUrl + '/utils/abonnement/' + uid + '/show' + '? uid=');
      
    return this.http.get(this.baseUrl + '/utils/abonnement/' + uid + '/show' + '? uid=', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }


    editInfo(info : any,uid: any) {
        return this.http.post(this.baseUrl + '/utils/info/' + uid + '/update', JSON.stringify(info), { headers: this.headers })
            .toPromise()
            .then(response => response.json());
    }



    getInfo(uid: any, registrationId?: any) {
        console.log(this.baseUrl + '/utils/info/' + uid + '/show?registrationId=' + registrationId);
        return this.http.get(this.baseUrl + '/utils/info/' + uid + '/show?registrationId=' + registrationId, { headers: this.headers })
            .toPromise()
            .then(response => response.json());
    }
}
