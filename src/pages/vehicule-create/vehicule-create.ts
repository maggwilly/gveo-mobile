import { Component } from '@angular/core';
import { NavController, NavParams , AlertController, ViewController, ModalController} from 'ionic-angular';
import { MarquesPage} from '../marques/marques';
import {AppNotify} from '../../app/app-notify';
import { Manager} from '../../providers/manager';
import {DatePipe} from "@angular/common";
import { AuthService} from '../../providers/auth-service';

/*
  Generated class for the VehiculeCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-vehicule-create',
  templateUrl: 'vehicule-create.html'
})
export class VehiculeCreatePage {
 
  action:any;
  submitted = false;
  round: boolean;
  expand: boolean;
  spinnerColor: string;
  devise;
  lang;
  public vehicule:any={};
  public matricule: any;
  marque:any;
  pattern="^[a-zA-Z]{2,}[0-9]{2,}[a-zA-Z]{2,}$"
  public cout_achat: any;
  public index0: any;
  public error: any;
  constructor(
    public navCtrl: NavController, 
    public auth: AuthService,
    public navParams: NavParams,
    public viewCtrl: ViewController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public appNotify: AppNotify,
    public manager: Manager,
    ) {
    let nowDate = new Date();
    var datePipe = new DatePipe('en');
    if (!this.navParams.get('vehicule') ){ 
      this.action = 'create'
      this.vehicule.id = Date.now();
      this.vehicule.dateMiseEnCirculation = datePipe.transform(nowDate, 'yyyy-MM-dd');       
    }else{
      this.vehicule = this.navParams.get('vehicule');
      this.marque = this.vehicule.marque;
      this.action = 'edit';
      this.vehicule.dateMiseEnCirculation = datePipe.transform(this.vehicule.dateMiseEnCirculation, 'yyyy-MM-dd');
    }
     
      this.vehicule.lastIndex=(this.vehicule.lastReleve)?this.vehicule.lastReleve.km:0;
  }



  ionViewDidLoad() {
    this.lang=this.auth.getLang();
    this.devise=this.auth.getDevise();
  }


   setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

isInvalid() {
   return (!this.vehicule.matricule||this.isMatriculeInvalid()||!this.marque ||!this.vehicule.index0 ||!this.vehicule.dateMiseEnCirculation);
  
  }

   dismiss(data?:any) { 
     return  this.viewCtrl.dismiss(data);  
  } 


isMatriculeInvalid(){
  return false;//!regexp.test(this.vehicule.matricule);
}

 selectMarque(){
 let profileModal = this.modalCtrl.create(MarquesPage,
  { }
  );
   profileModal.onDidDismiss(data => {
     if(!data)
       return;
       this.marque=data;
   });

   profileModal.present({
     animate:true,
     direction:'forward'//'up'
    });
 }

 
   onSubmit() {
     this.vehicule.marque=this.marque.id;
     this.submitted=true;
     switch (this.action) {
       case 'create':
         this.manager.create('vehicule',this.vehicule).then((data)=>{
            this.appNotify.onSuccess({message:"Nouveau vehicule créé"})
           this.dismiss(data);
         },error=>{
             this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
         });
         break;
       default:
         this.manager.update('vehicule',this.vehicule).then(() => {
           this.appNotify.onSuccess({ message: "Modifications enrégistrées" })
           this.submitted = false;
         }, error => {
             this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
         });
         break;
     }
    
        
  } 

   showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Toutes les informations sur ce véhicule seront perdues.Voulez-vous vraiment supprimer ? ',
      buttons: [
        {
          text: 'Non',
          handler: () => {   
          }
        },
        {
          text: 'OUI',
          handler: () => {
            this.submitted=true;
            this.vehicule.deleted=true;
            return this.manager.delete('vehicule', this.vehicule).then(data=>{
              this.appNotify.onSuccess({ message: "véhicule supprimée" })
            this.dismiss();
          }) 
        }
      }
      ]
    });
    confirm.present();
  }   
}
