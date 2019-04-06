import { Component } from '@angular/core';
import { NavController,  ViewController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Manager } from '../../providers/manager';
@Component({
  selector: 'page-accordion-list',
  templateUrl: 'accordion-list.html',
})
export class AccordionListPage {
  _vehicules:any = [   ]
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public storage: Storage, public manager: Manager) {
    this.storage.get("_vehicules").then(data => {
      this._vehicules = data ? data : [];
    });
   }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }  

}
