import { Component, ViewChild } from '@angular/core';
import {Events, NavController, AlertController ,NavParams,ModalController, List} from 'ionic-angular';
import { ReparationCreatePage} from '../reparation-create/reparation-create';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the ReparationList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reparation-list',
  templateUrl: 'reparation-list.html'
})
export class ReparationListPage {
_maintenances:any[]=[];
  devise = "XAF";
  lang = "fr";
  systeme:any={};
  displayed:any;
 @ViewChild('maintenancesList', {read: List}) maintenancesList: List;
  constructor(public navCtrl: NavController,
   public storage: Storage,
   public modalCtrl: ModalController,  
   public auth: AuthService,
   public alertCtrl: AlertController,
   public navParams: NavParams,
   public manager: Manager,
    public appNotify: AppNotify,
   public events: Events,) {
   this.systeme=this.navParams.get('systeme');
    this.displayed = this.navParams.get('displayed')
    this.updateSchedule();
  // 
   ;
  }

updateSchedule() {
  this.systeme.cout=0;
  this.manager.getMaintenances(this.displayed.id, this.systeme.id).then((data) => {
    this.systeme.maintenances = data ? data : [];
    this.systeme.maintenances.forEach(maintenance => {
      this.systeme.cout += Number(this.coutTotal(maintenance));
    });
     
  }, error => {
    this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
  })
}
  
listenToEvents() {
  this.events.subscribe('displayed:changed', (data) => {
      this.displayed = data;
    //this.updateSchedule();
    });
  }


coutTotal(maintenance:any):number{
   let cout=0;
     cout+=Number(maintenance.cout);
    cout+=Number(maintenance.coutMainOeuvre);
return cout;
}

newReparation(){
  let modal = this.modalCtrl.create(ReparationCreatePage,{systeme:this.systeme,displayed:this.displayed});
  modal.onDidDismiss((data)=>{
    if (!data)
       return 
    this.systeme.maintenances.push(data);
    this.systeme.maintenances.forEach(maintenance => {
      this.systeme.cout += Number(this.coutTotal(maintenance));
    });
  })
  modal.present();
}


editReparation(maintenance:any){
  let modal = this.modalCtrl.create(ReparationCreatePage, { systeme: this.systeme, maintenance: maintenance});
  modal.onDidDismiss((data) => {
    if (!data)
      return
    this.systeme.maintenances.forEach(maintenance => {
      this.systeme.cout += Number(this.coutTotal(maintenance));
    });
  })
  modal.present();
}



findAndRemove(array:any[],item:any){
array.forEach(element => {
   if(element.id==item.id)
      element.deleted=true;
      return this.manager.delete('maintenance',item).then(data=>{
        this.appNotify.onSuccess({ message: "Opération supprimée" })
    })   
});
}
}
