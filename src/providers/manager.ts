import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth-service';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../app/app-notify';
import firebase from 'firebase';
@Injectable()
export class Manager {
  baseUrl: string;
  headers: Headers;
  constructor(
    public http: Http,
    public authservice: AuthService,
    public events: Events,
    public appNotify: AppNotify,
    public storage: Storage
  ) {
    this.baseUrl = authservice.baseUrl;
  }

  getHeader(): Headers {
    return new Headers({ 
      'Content-Type': 'application/json',
      'X-Auth-Token': firebase.auth().currentUser? firebase.auth().currentUser.uid :"",
      'X-Device-Token': this.authservice.getAuToken()
    });
  }

  getVehicules(uid) {
    return this.http.get(this.baseUrl + '/utils/vehicule?uid=' + firebase.auth().currentUser.uid, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getEntity(entityName) {
    return this.http.get(this.baseUrl + '/utils/' + entityName, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getSystemes() {
    return this.http.get('assets/data/systemes.json')
      .toPromise()
      .then(response => response.json());
  }

  getOperations() {
    return this.http.get('assets/data/operations.json')
      .toPromise()
      .then(response => response.json());
  }


  getMarques() {
    return this.http.get('assets/data/marques.json')
      .toPromise()
      .then(response => response.json());
  }

  delete(entity, data) {
    return this.http.delete(this.baseUrl + '/utils/' + entity +'/'+data.id + '/delete?id='+ data.id, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  create(entity, element) {
    console.log(element);
    return this.http.post(this.baseUrl + '/utils/' + entity + '/create', JSON.stringify(element), { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  update(entityName, data: any) {

    return this.http.post(this.baseUrl + '/utils/' + entityName +'/'+data.id +'/update?id='+ data.id, JSON.stringify(data), { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }
  


  /*Recherche la date de derniere mise a jour*/
  getAbonnementTest(uid: any) {
    return this.http.get('assets/data/abonnement.json', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  getVisiteTechnique(vehicule: number) {
    console.log(this.baseUrl + '/utils/visite/last?vehicule=' + vehicule);
    return this.http.get(this.baseUrl + '/utils/visite/last?vehicule=' + vehicule, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }


  getPoliceAssurance(vehicule: number) {
    return this.http.get(this.baseUrl + '/utils/police/last?vehicule=' + vehicule, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getMaintenances(vehicule: number, systeme: number) {
    return this.http.get(this.baseUrl + '/utils/maintenances/list?vehicule=' + vehicule + '&systeme=' + systeme, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getReparation(vehicule: number, operation: number) {
    return this.http.get(this.baseUrl + '/utils/reparation/last?vehicule=' + vehicule + '&operation=' + operation, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getReleve(vehicule: number) {
    return this.http.get(this.baseUrl + '/utils/releve/last?vehicule=' + vehicule , { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }
  getStatistic(vehicule: number = 0, start: any, end:any ,periode?:any) {
    return this.http.get(this.baseUrl + '/utils/couts?vehicule=' + vehicule + '&startdate=' + start + '&enddate=' + end + '&periode=' + periode + '&uid=' + firebase.auth().currentUser.uid, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  getTodos(vehicule: number = 0) {
    console.log(this.baseUrl + '/utils/operation/todos?vehicule=' + vehicule + '&uid=' + firebase.auth().currentUser.uid)
    return this.http.get(this.baseUrl + '/utils/operation/todos?vehicule=' + vehicule + '&uid=' + firebase.auth().currentUser.uid, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

  isTodos() {
    return this.http.get(this.baseUrl + '/utils/is/todos?uid=' + firebase.auth().currentUser.uid, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  }

 needControl() {
    return this.http.get(this.baseUrl + '/utils/need/control?uid=' + firebase.auth().currentUser.uid, { headers: this.getHeader() })
      .toPromise()
      .then(response => response.json());
  } 
  

}
