import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController, AlertController,ModalController } from 'ionic-angular';
import { DatePipe } from "@angular/common";
import { AppNotify } from '../../app/app-notify';
import { Manager } from '../../providers/manager';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
/*
  Generated class for the PrevisionCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reparation-create',
  templateUrl: 'reparation-create.html'
})
export class ReparationCreatePage {
  reparation: any={};
  systeme: any = {};
  displayed: any;
  devise = "XAF";
  lang = "fr";
  action: any;
  submitted = false;
  round: boolean;
  expand: boolean;
  spinnerColor: string;
  lastKm:any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,  
    public alertCtrl: AlertController,
    public auth: AuthService,
    public appNotify: AppNotify,
    public events: Events,
    public storage: Storage,
    public navParams: NavParams,
    public manager: Manager
  ) {
    this.systeme = this.navParams.get('systeme');
    this.displayed = this.navParams.get('displayed');
    let nowDate = new Date();
    var datePipe = new DatePipe('en');
    if (!this.navParams.get('maintenance')){
      this.action = 'create';
      this.reparation.dateSave = datePipe.transform(nowDate, 'yyyy-MM-dd');
    }
    else{
      this.action = 'edit';
      this.reparation = this.navParams.get('maintenance');
      this.reparation.dateSave = datePipe.transform(this.reparation.dateSave, 'yyyy-MM-dd');
    }
    this.storage.get('_displayed').then(data => {
      this.reparation.km = data && data.lastReleve ? data.lastReleve.km : 0
    });     
  }

  ionViewDidLoad() {
    this.lang = this.auth.getLang();
    this.devise = this.auth.getDevise();
    this.storage.get('_displayed').then(data=>{
      this.lastKm = data && data.lastReleve ? data.lastReleve.km:0
    });
  }


  select(){
    let modal = this.modalCtrl.create('PiecesPage',{systeme:this.systeme.id});
    modal.onDidDismiss(data => {
      console.log(data);
         if(!data)
           return
         this.reparation.description=data.nom;
    });
    modal.present();
  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  onSubmit() {
    this.submitted = true;
    switch (this.action){
      case 'create':
        let date = new Date();
        this.reparation.year = date.getFullYear();
        this.reparation.month = date.getMonth(); 
        this.reparation.systeme = this.systeme.id;
        this.reparation.vehicule = this.displayed.id;
        this.reparation.id=Date.now();
        this.manager.create('maintenance',this.reparation).then(() => {
          this.events.publish('maintenance:created');
          this.dismiss(this.reparation);
        }, error => {
          this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
        })
        break;
      default:
        this.manager.update('maintenance',this.reparation).then(() => {
          this.events.publish('maintenance:update');
          this.dismiss(this.reparation);
          this.submitted = false;
        }, error => {
          this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
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
    return (!this.reparation.dateSave || (!(this.reparation.coutMainOeuvre && this.reparation.cout)) || !this.reparation.description);
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Voulez-vous vraiment supprimer ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          }
        },
        {
          text: 'OUI',
          handler: () => {
            this.submitted = true;
            this.reparation.deleted = true;
            this.dismiss(this.reparation);
          }
        }
      ]
    });
    confirm.present();
  }
}
