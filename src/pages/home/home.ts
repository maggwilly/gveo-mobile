import { Component } from '@angular/core';
import { Manager } from '../../providers/manager';
import { Events, NavController, LoadingController } from 'ionic-angular';
import { PrevisionPage } from '../prevision/prevision';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { AppNotify } from '../../app/app-notify';
export class Reparation {
  id: number;
  km: number;
  dateSave: string;
  duree: number;
  cout: number;
  operation: number;
  vehicule: number;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  operations: any[];
  _reparations: any[];
  displayed: any;
  _releves;
  devise;
  lang;
  loading;
  constructor(
    public navCtrl: NavController,
    public events: Events, 
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public auth: AuthService,
    public appNotify: AppNotify,
    public manager: Manager) {
    this.events.subscribe('displayed:changed', (data) => {
      this.displayed = data;
      this.loadData();
    });
  }

  ionViewDidLoad() {
    this.storage.get('_displayed').then((data) => {
      this.displayed = data;
      this.loadData();
    });    
   
  }

  loadData() {
    this.lang = this.auth.getLang();
    this.devise = this.auth.getDevise();
    this.storage.get('_operations')
      .then((data) => {
      this.operations = data ? data : [];
        if (!this.operations || !this.operations.length) {
          this.loading = this.loadingCtrl.create();
          this.loading.present();
        }
        
        this.manager.getEntity('Operation')
        .then(data => {
        this.operations = data;
          this.storage.set('_operations', data);
        if (this.loading)
            this.loading.dismiss();
        }, error => {
          if (this.loading)
            this.loading.dismiss();
          this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
        }) 
      })
  }

  showPrevision(operation) {
    this.navCtrl.push(PrevisionPage, { operation: operation ,displayed: this.displayed });
  }
}
