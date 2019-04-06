import { Component } from '@angular/core';
import {Events, NavController, NavParams ,ModalController,AlertController, ViewController,} from 'ionic-angular';
import { PrevisionCreatePage} from '../prevision-create/prevision-create';
import { Manager} from '../../providers/manager';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import { AppNotify } from '../../app/app-notify';

@Component({
  selector: 'page-prevision',
  templateUrl: 'prevision.html'
})
export class PrevisionPage {
   operation:any={};
  _reparations:any[]=[];
   displayed:any;
   devise;
   lang;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public manager: Manager,
    public storage: Storage,
    public auth: AuthService,
    public events: Events,
    public viewCtrl: ViewController, 
    public appNotify: AppNotify,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.operation=this.navParams.get('operation');
    this.displayed = this.navParams.get('displayed');  
    console.log(this.displayed);
      
    this.updateSchedule();
    this.listenToEvents();
      this.lang=this.auth.getLang();
      this.devise=this.auth.getDevise();
  }

  listenToEvents() {
    this.events.subscribe('displayed:changed', () => {      
      this.updateSchedule();
    });
  let event:any[]=[
'reparation:deleted',
'reparation:created',
];
event.forEach(element => {
  this.events.subscribe(element, (data) => {      
    this.operation.lastReparation = data;
    this.calcul();
});
});
}

dismiss(data?:any) { 
  return  this.viewCtrl.dismiss(data);  
} 

 updateSchedule() {
  /* this.storage.get('_displayed').then((data) => {
     this.displayed = data;*/
   this.manager.getReparation(this.displayed.id,this.operation.id).then((data)=>{
       this.operation.lastReparation = data;//there
       this.operation.loaded=true;
       this.calcul();
   }, error => {
     this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
   })
 /*  });*/
  }

calcul(){
  if (this.displayed && this.operation.lastReparation && this.displayed.lastReleve)
    this.operation.kmt = (this.displayed.lastReleve.km - this.operation.lastReparation.km);
  if (this.operation.kmt && this.operation.lastReparation)
    this.operation.kmrt = (this.operation.lastReparation.duree - this.operation.kmt);
  else if (!this.operation.kmt && this.operation.lastReparation) 
    this.operation.kmrt = this.operation.lastReparation.duree
}


nextKm(operation:any):number{
return operation.lastReparation? Number(operation.lastReparation.duree)+ Number(operation.lastReparation.km):null;
  
}

creerPrevision(){
  let modal = this.modalCtrl.create(PrevisionCreatePage, { operation: this.operation, displayed: this.displayed});
  modal.onDidDismiss(data=>{
    if (!data)
       return 
  })
  modal.present();
}


  updatePrevision() {
    let modal = this.modalCtrl.create(PrevisionCreatePage, { operation: this.operation, lastReparation: this.operation.lastReparation });
    modal.onDidDismiss(data => {
      if (!data)
        return
    }) 
    modal.present();
  }


   showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Voulez-vous vraiment supprimer ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OUI',
          handler: () => {
        this.findAndRemove(this._reparations,this.operation.lastReparation); 
        }
      }
      ]
    });
    confirm.present();
  }


findAndRemove(array:any[],item:any){
array.forEach(element => {
   if(element.id==item.id){
    element.deleted=true;
      return this.manager.delete('reparation',item).then(data=>{
        this.appNotify.onSuccess({ message: "Reparation supprimée" })
      this.dismiss();
    })
   }
   
});
}
}
