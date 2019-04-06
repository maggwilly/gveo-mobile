import { Component } from '@angular/core';
import { NavController ,AlertController,LoadingController,Events} from 'ionic-angular';
import { AuthService} from '../../providers/auth-service';
import { EditProfilePage} from '../edit-profile/edit-profile';
import { AboutPage} from '../about/about';
import { Storage } from '@ionic/storage';
import {AppNotify} from '../../app/app-notify';
import firebase from 'firebase';
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettinsPage {
	pages: Array<{title: string,  component: any,icon:string}>;
  isConnected:boolean=false;
  loading; error:any;
  constructor(
   public appNotify: AppNotify , 
  public navCtrl: NavController,  public storage: Storage,  public events: Events,
  public alertCtrl: AlertController, 
   public loadingCtrl: LoadingController,
  public authService:AuthService) {
    	this.pages = [ 
       { title: 'Modifier les parametres' ,  component: EditProfilePage  ,icon:'md-settings'},
       { title: 'A propos de gVeo' ,    component: AboutPage  ,icon:'md-more'},
    ];

    
  }

  ionViewDidLoad() {
    console.log('Hello CreateOptionPage Page');
  
  }

 
  openPage(page:any) {
    if (!page) {
        return;
  }
    this.navCtrl.push(page.component);
  }
 
    showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Deconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          console.log('Disagree clicked');
          }
        },
        {
          text: 'Deconnecter',
          handler: () => {
           this.logoutUser();
            
        }
      }
      ]
    });
    confirm.present();
  }
  
logoutUser() {
  return firebase.auth().signOut().then(()=>{
    this.storage.clear();
    this.events.publish('logout:success');

  });
 }



 organiser(arr:any[]){
   arr.forEach(element => {
     element.restant=0;
   });
 }



 errorAlert(error){
        this.error = error;
        let errorAlert = this.alertCtrl.create({
          message:this.error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
           this.loading.dismiss().then(()=>{
              errorAlert.present();
           });

      }
 
}
