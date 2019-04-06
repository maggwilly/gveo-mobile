import { Component } from '@angular/core';
import { NavController, ViewController  } from 'ionic-angular';
import { CompteService} from '../../providers/compte-service';
/*
  Generated class for the Select page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-select',
  templateUrl: 'select.html'
})
export class SelectPage {
 items:any= [
          { code: '237', nom: 'Cameroun','countryCode':'CM' },
          { code: '205', nom: 'Nigeria' ,'countryCode':'NG'},
          { code: '82', nom: 'Us America','countryCode':'US' }
];
  constructor(
    public navCtrl: NavController,
    public compteService:CompteService,
    public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('Hello SelectPage Page');
  }


 ngAfterViewInit() {
    console.log('Hello LocalisationPage Page');
    // 	this.compteService.getLocalData()
     //  .then(data=>{
     //      this.items=data.pays;
    //   });
  
  }

  dismiss(selectedItem:any={}) {
   this.viewCtrl.dismiss(selectedItem);
 } 
}
