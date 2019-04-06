import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http , Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
 

 private headers = new Headers({'Content-Type': 'application/json'});
 baseUrl: string ='https://apigveo.herokuapp.com/v1/formated';   
  // baseUrl: string = 'http://localhost:8000/v1/formated';   
    constructor(public http: Http,public events: Events,) {      
    }

    getHeader():Headers{
     return new Headers({'Content-Type': 'application/json','X-Auth-Token':this.getAuToken()});
    }
    
    storeUserCredentials(token) {
        window.localStorage.setItem('_token', token);    
    }

    storeUser(user:any) {
        window.localStorage.setItem('_user_id', user);
        
    }

getAuToken():string{
	let token = window.localStorage.getItem('_token');
	return "token";
}


isLooged():boolean{
	let _is_logged = window.localStorage.getItem('_is_logged');
	return _is_logged?true:false;
}    
 
setLooged(){
    window.localStorage.setItem('_is_logged', "_is_logged");
}

setLang(lang:any){
    if(!lang){
       window.localStorage.setItem('_lang', "fr");
     return;
  
    } 
    let _lang = window.localStorage.getItem('_lang');
    window.localStorage.setItem('_lang', lang);
    if(_lang!==lang)
       this.events.publish('lang:changed',lang);
}


getLang():string{
    let _lang = window.localStorage.getItem('_lang');
    return _lang?_lang:"fr";
}
getDevise():string{
    let _devise = window.localStorage.getItem('_devise');
    return _devise?_devise:"XAF";
}

setDevise(devise:any){
     if(!devise){
    window.localStorage.setItem('_devise', "XAF");
    return;
     }
       let _devise = window.localStorage.getItem('_devise');
       
    window.localStorage.setItem('_devise', devise);
      if(_devise!==devise)
    this.events.publish('devise:changed',devise);
}

removeLooged(){
    window.localStorage.removeItem('_is_logged');
}


authenticate(credentials: any) {
         return  this.http.post(this.baseUrl+'/login', JSON.stringify(credentials), { headers:this. headers })
              .toPromise()
             .then(response => response.json())
      }    

    destroyUserCredentials() {
        window.localStorage.clear();
    }

    
   logout() {
      this.events.publish('logout:success');  
   }


   
/*private jsonToURLEncoded(jsonString){
    return Object.keys(jsonString).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(jsonString[key]);
    }).join('&');
}*/
}