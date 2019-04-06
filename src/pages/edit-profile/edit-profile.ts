import { Component } from '@angular/core';
import { NavController, Platform, ModalController ,ViewController} from 'ionic-angular';
import { CompteService} from '../../providers/compte-service';
import { SelectPage} from '../select/select';
import {AppNotify} from '../../app/app-notify';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import { Manager } from '../../providers/manager';
import firebase from 'firebase';
/*
  Generated class for the Signup page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
  user:any;
  submitted = false;
  round: boolean;
  expand: boolean;
  spinnerColor: string;
  country:any={ code: '237', nom: 'Cameroun','countryCode':'CM' };
  registrationId:any;
   constructor(
   public navCtrl: NavController,
   public compteService: CompteService, 
   public auth:AuthService,
   public storage: Storage,
   public platform: Platform,
    public manager: Manager,
   public modalCtrl: ModalController,
   public appNotify: AppNotify,
   public viewCtrl: ViewController,
   ) { 
     this.storage.get('registrationId').then((data) => {
       this.registrationId = data;
       this.getUserProfile(); 
     });
    
     }




 selectCountry(){  
    let profileModal = this.modalCtrl.create(SelectPage,{ });
     profileModal.onDidDismiss(data => {
     this.country=data;
   });
     profileModal.present({
     animate:true,
     direction:'forward'//'up'
    });
 } 

setLang(event:any){
  //this.auth.setLang(event);
console.log(JSON.stringify(event));
}

setDevise(event:any){
//  this.auth.setDevise(event);
 console.log(JSON.stringify(event));
 
}

  getUserProfile() {
    return this.storage.get(firebase.auth().currentUser.uid).then((info) => {
      this.user = info ? info : firebase.auth().currentUser;
      return this.compteService.getInfo(firebase.auth().currentUser.uid, this.registrationId).then((info) => {
        if (info) {
          this.user = info;
          this.storage.set(firebase.auth().currentUser.uid, info);
        }
      },
        error => {
          console.log(error);
          this.appNotify.onError({ message: 'problème de connexion.' });
        })
    })

  }

onSubmit() {
    this.submitted = true;
    return this.compteService.editInfo(this.user,firebase.auth().currentUser.uid).then((info) => {
      if (info) {
        this.user = info;
        this.storage.set(firebase.auth().currentUser.uid, info);
        this.appNotify.onSuccess({ message: 'Mise à jour effectuée !'});
        this.viewCtrl.dismiss();    
      }
    })

   }

setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

isInvalid() {
  if (!this.user.displayName||!this.user.phone||!this.user.email) {
           return true;
      } else {
          return false;
      }    
  }


}
