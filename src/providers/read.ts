import { Injectable } from '@angular/core';
import { Http , Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthService} from './auth-service';
import {TranslateService} from 'ng2-translate';
import { HTTP } from 'ionic-native';

@Injectable()
export class Read {
    headers:Headers;
    baseUrl:string;
    constructor(public http: Http,public authservice: AuthService,public translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.onDefaultLangChange.subscribe(event,{
      
    });
    
 
  }
 getAbaout(local=this.translateService.getBrowserLang()) {

   return this.http.get('assets/data/'+local+'_abaout.json')
              .toPromise()
               .then(response =>response.json())
               .catch(this.handleError);   
    
                
      }

getHelp(local=this.translateService.getBrowserLang()) {
       return HTTP.get('assets/data/help.json',  {local:local}, {headers: this.headers})
     .then(res =>res.data)
     .catch(error => {
         console.log(error.status);
         console.log(error.error); // error message as string
         console.log(error.headers);
     });     
      }

    getCGU(local=this.translateService.getBrowserLang()) {
   return HTTP.get('assets/data/cgu.json',  {local:local}, {headers: this.headers})
     .then(res =>res.data)
     .catch(error => {
         console.log(error.status);
         console.log(error.error); // error message as string
         console.log(error.headers);
     });     
      }      
  private handleError(error: any): Promise<any> {
   console.error('An error occurred', error); // for demo purposes only
  return Promise.reject(error.message || error);
}
}
