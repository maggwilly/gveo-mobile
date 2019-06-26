import { Component} from '@angular/core';
import {Events, NavController , LoadingController } from 'ionic-angular';
import { Manager} from '../../providers/manager';
import { ReparationListPage} from '../reparation-list/reparation-list';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import { AppNotify } from '../../app/app-notify';
@Component({
  selector: 'page-systemes',
  templateUrl: 'systemes.html'
})
export class SystemesPage {
 systemes:any=[];
 displayed:any;
  devise = "XAF";
  loading;
  constructor(public navCtrl: NavController,
  public auth: AuthService,
  public loadingCtrl: LoadingController,
  public storage: Storage,
  public events: Events,
    public appNotify: AppNotify,
  public manager: Manager,
  ) {
      this.listenToEvents()
    this.storage.get('_displayed').then((data) => {
      this.displayed = data;
    });  
  }
  ionViewDidLoad() {
    this.loadData();
  }


    loadData() {
      this.storage.get( '_systemes')
      .then((data)=>{
        this.systemes = data ? data : [];
        if (!this.systemes.length){
          this.loading = this.loadingCtrl.create();
          this.loading.present();
        }
          this.manager.getEntity('Systeme').then(data => {
            this.systemes = data;
            this.storage.set('_systemes', data);
          if (this.loading)
            this.loading.dismiss().then();
          }, error => {
            this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
          })
   })

  }



 listenToEvents() {
   this.events.subscribe('displayed:changed', (data) => {
     this.displayed = data;
    });

    this.events.subscribe('lang:changed', () => {
          this.loadData();
    });    
  }


newReparation(systeme){
  this.navCtrl.push(ReparationListPage,{systeme:systeme,displayed:this.displayed});
}
}
