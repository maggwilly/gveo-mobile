import { Component, Input } from '@angular/core';
import { Manager } from '../../providers/manager';
import { Events, AlertController, App } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { Storage } from '@ionic/storage';
import { StatPage } from '../../pages/stat/stat';
import { AccordionListPage } from '../../pages/accordion-list/accordion-list';
/*
  Generated class for the Header component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  @Input()
  text: string;
  @Input()
  displayed: any;
  @Input()
  statshow
  @Input()
  recapshow
  isTodos='';
  constructor(
    public events: Events,
    public manager: Manager,
    public appNotify: AppNotify,
    public alertCtrl: AlertController,    
    public appCtrl: App,
    public storage: Storage) {
    this.text = '';
    this.listenToEvents();
  }


  
  ngOnChanges() {
    if (!this.displayed)
    return;
      this.joursRestant(this.displayed.lastReleve);
  }

  
  ngOnInit() {
    this.manager.isTodos().then((data) => {
      this.isTodos = data? '!':'';
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
    this.ngOnChanges();
  }

  openStat(){
    this.appCtrl.getRootNav().push(StatPage)
  }

  openRecap() {
    this.appCtrl.getRootNav().push(AccordionListPage)
  }



  listenToEvents() {
    this.events.subscribe('releve:created', (data)  => {
      this.displayed.lastReleve = data;
      this.storage.set('_displayed', this.displayed)
      this.joursRestant(this.displayed.lastReleve);
      this.displayed.lastReleve.color = "secondary"
    });
  }


  createReleve() {
    let confirm = this.alertCtrl.create({
      title: 'Kilométrage',
      message: 'Mise à jour du kilométrage',
      inputs: [
        {
          name: 'km',
          type: 'number',
          label: 'Kilométrage',
          value: this.displayed.lastReleve ? this.displayed.lastReleve.km : this.displayed.index0
        }
      ],
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Enrégistrer',
          handler: data => {
              data.vehicule = this.displayed.id;
            this.manager.create('releve', data).then((rel)=>{
              this.displayed.lastReleve = rel;
              console.log(rel);
             
              this.getColor(this.displayed.lastReleve);
              this.events.publish('releve:created', data)
              //regarder
            }, error => {
              this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
            });
          }
        }
      ]
    });
    confirm.present();
  }


  joursRestant(objet: any) {
    if (!objet)
      return;
    this.storage.set('_displayed', this.displayed);
    let diffDays = Math.ceil((new Date().getTime() - new Date(objet.dateSave).getTime()) / (1000 * 3600 * 24));
    objet.restant = diffDays;
    this.setColorIcon(objet);
    return objet;
  }


  setColorIcon(objet: any) {
    let n = objet.restant;
    if (n >= 0 && n < 3) {
      objet.color = "secondary";
      objet.icon = "ios-warning-outline";
      return;
    }
    else if (n > 2 && n < 5) {
      objet.color = "orange";
      objet.icon = "ios-warning";
      return;
    }
    objet.color = "danger";
  }


  getColor(obj ) {
    if(!obj)
       return 
    let relevDate = obj.dateSave;
    let relevTime = new Date(relevDate).getTime();
    let now = Date.now();
    if (!relevDate || (now - relevTime) > 5 * 24 * 3600 * 1000){
      obj.color = 'danger'
      return 'danger';
    }
    obj.color = 'secondary'
    return 'secondary';   
  }
}
