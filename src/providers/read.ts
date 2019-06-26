import { Injectable } from '@angular/core';
import { Http , Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthService} from './auth-service';
import {TranslateService} from 'ng2-translate';


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
       return this.http.get('assets/data/help.json')
       .toPromise()
     .then(res =>res)
     .catch(error => {
     });     
      }

    getCGU(local=this.translateService.getBrowserLang()) {
   return this.http.get('assets/data/cgu.json')
   .toPromise()
     .then(res =>res)
     .catch(error => {

     });     
      }      
  private handleError(error: any): Promise<any> {
   console.error('An error occurred', error); // for demo purposes only
  return Promise.reject(error.message || error);
}
}
