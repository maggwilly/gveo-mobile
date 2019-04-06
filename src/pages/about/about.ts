import { Component} from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import firebase from 'firebase';
/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage{
 abaout={};
 loading; 
  devise;
  lang;
  constructor(public navCtrl: NavController,public storage:Storage,public loadingCtrl: LoadingController, public auth: AuthService,) {

  }


  ionViewDidLoad() {
      this.lang=this.auth.getLang();
      this.devise=this.auth.getDevise();
     this.storage.get(this.lang+'_abaout').then((data)=>{
               this.abaout=data;   
             if( !this.abaout){
                 this.loading = this.loadingCtrl.create();
                 this.loading.present();   
              }    
         firebase.database().ref('/abaout/'+this.lang).once('value',(abaout)=>{
          if(abaout.val()){
           this.abaout=abaout.val();     
             this.storage.set(this.lang+'_abaout', this.abaout)
          } 
          if(this.loading)
           this.loading.dismiss().then();
      });   
    });
     
  }
}
