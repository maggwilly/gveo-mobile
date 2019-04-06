import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

/*
  Generated class for the ExpirePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-expire',
  templateUrl: 'expire.html'
})
export class ExpirePagePage {
  abonnement:any;
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
  ) {}

  ionViewDidLoad() {
    this.abonnement = this.navParams.get('abonnement');
  }

  isExpired(abonnement: any) {
    if (!abonnement)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  } 
}
