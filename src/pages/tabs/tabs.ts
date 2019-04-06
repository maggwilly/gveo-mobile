import { Component, ViewChild } from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { HomePage } from '../home/home';
import { SystemesPage } from '../systemes/systemes';
import { UtilisationPage} from '../utilisation/utilisation';
import { LegislationPage} from '../legislation/legislation';
import { Tabs} from 'ionic-angular';
import { Events, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = SystemesPage;
  tab3Root: any = LegislationPage;
  tab4Root: any = UtilisationPage;
  needControl
  tab:any
  vehicule:any;
  @ViewChild('myTabs') tabRef: Tabs;
  constructor(
     public manager: Manager, 
     public navParams: NavParams,
     public events: Events,
     public appNotify: AppNotify,
    public storage: Storage,
    ) {
    this.vehicule = this.navParams.get('vehicule');
    this.tab = this.navParams.get('tab');
    let userEvents: any[] = [
      'visite:update',
      'visite:created',
      'police:update',
      'police:created',
    ];
    userEvents.forEach(element => {
      this.events.subscribe(element, () => {
        this.ngOnInit()
      });})

  }


  ionViewDidEnter() {
    if (this.vehicule)
    this.select(this.vehicule);
    if (!this.tab)
      return;
    this.tabRef.select(this.tab);
  }

  select(vehicule) {
    this.storage.set('_displayed', vehicule).then(() => {
      this.events.publish('displayed:changed', vehicule);
    });
  }
  ngOnInit() {
 /*   this.manager.needControl().then((data) => {
      this.needControl = data ?'!':'';
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })*/
  }  
}
