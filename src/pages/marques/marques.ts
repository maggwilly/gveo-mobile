import { Component } from '@angular/core';
import { NavController, NavParams , ViewController } from 'ionic-angular';
import { Manager} from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { Storage } from '@ionic/storage';
/*
  Generated class for the Marques page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-marques',
  templateUrl: 'marques.html'
})
export class MarquesPage {
marques:any=[];
  constructor(
   public navCtrl: NavController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public manager: Manager,
    public appNotify: AppNotify,
   public navParams: NavParams) {

     
   }

 ngAfterViewInit() {
    this.updateSchedule();
  }


updateSchedule() {
  this.storage.get('_marques').then((data) => {
    this.marques = data;
    this.manager.getEntity('Marque')
  .then(data => {  
    this.marques = data;
    this.storage.set('_marques', this.marques);
  }, error => {
    this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
  });
  });
  }

 dismiss() {
   this.viewCtrl.dismiss();
 }

 onSelect(marque:any) {
   this.viewCtrl.dismiss(marque);
 }   
}
