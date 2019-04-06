import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/*
  Generated class for the RecapPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recap',
  templateUrl: 'recap.html'
})
export class RecapPagePage {
  _vehicules: any[]
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public storage: Storage
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecapPagePage');
    this.updateSchedule();
  }
  
  updateSchedule() {
    return this.storage.get('_vehicules').then((data) => {
      this._vehicules = this.avalableList(data);
    }
    )
  }

  avalableList(list: any[]) {
    if (!list)
      return [];
    return list.filter((rep) => {
      return !rep.deleted;
    });
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }
  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this._vehicules.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });
  }


  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.matricule.toLowerCase().indexOf(queryWord) > -1 || item.chauffeur.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

}
