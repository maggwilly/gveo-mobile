import { Component } from '@angular/core';
import { Events,  NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {DatePipe} from "@angular/common";
import {AppNotify} from '../../app/app-notify';
import { Manager} from '../../providers/manager';


/*
  Generated class for the PrevisionCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-prevision-create',
  templateUrl: 'prevision-create.html'
})
export class PrevisionCreatePage {
 operation:any={};
 lastReparation:any={};
 action:any;
 submitted = false;
 round: boolean;
 expand: boolean;
 spinnerColor: string;
 displayed:any;
_releves;
  devise = "XAF";
  lang = "fr";
  lastKm: any;
  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams, 
  public alertCtrl: AlertController,
  public appNotify: AppNotify,
  public viewCtrl: ViewController,
  public events: Events,
  public storage: Storage,
  public manager: Manager) {

  }


  ionViewDidLoad() {
    this.operation = this.navParams.get('operation');
    this.displayed = this.navParams.get('displayed');
    let nowDate = new Date();
    let datePipe = new DatePipe('en');
    if (!this.navParams.get('lastReparation')) {
      this.action = 'create'
      this.lastReparation.dateSave = datePipe.transform(nowDate, 'yyyy-MM-dd');
    }
    else{
      this.action = 'edit';
      this.lastReparation = this.navParams.get('lastReparation');
      this.lastReparation.dateSave = datePipe.transform(this.lastReparation.dateSave, 'yyyy-MM-dd'); 
    }
    this.lastReparation.km=this.displayed.lastReleve ? this.displayed.lastReleve.km : 0
   /* this.storage.get('_displayed').then(data => {
      this.lastReparation.km = data && data.lastReleve ? data.lastReleve.km : 0
    });*/    
  }



  dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 

  onSubmit(){
    let date = new Date();
    this.submitted=true;
    switch (this.action) {
      case 'create':
        this.lastReparation.year = date.getFullYear();
        this.lastReparation.month = date.getMonth();
        this.lastReparation.id = Date.now();
        this.lastReparation.vehicule = this.displayed.id;
        this.lastReparation.operation = this.operation.id;      
        this.manager.create('reparation',this.lastReparation).then(()=>{
          this.events.publish('reparation:created', this.lastReparation);
          this.dismiss(this.lastReparation);    
        }, error => {
          this.appNotify.onSuccess({ message: "Problème ! " })
        })
        break;
      default:
        this.manager.update('reparation',this.lastReparation).then((data) => {
          this.events.publish('reparation:update',this.lastReparation);
          this.lastReparation=data;
          this.submitted = false;
        },error=>{
          this.appNotify.onSuccess({ message: "Une erreur s'est produite " })
        })      
        break;
    }
    
  }

setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

isInvalid() {
   return (!this.lastReparation.dateSave||!this.lastReparation.duree||!this.lastReparation.cout ||!this.lastReparation.km); 
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
       this.lastReparation.deleted=true;
       return this.manager.delete('reparation', this.lastReparation).then(data=>{
        this.appNotify.onSuccess({ message: "Reparation supprimée" })
        this.dismiss();
    },error=>{
      this.appNotify.onSuccess({ message: "Une erreur s'est produite " })
    }) 
        
        }
      }
      ]
    });
    confirm.present();
  } 
}
