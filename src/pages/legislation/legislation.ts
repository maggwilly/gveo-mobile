import { Component } from '@angular/core';
import { Events, NavController, NavParams, ModalController, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { PoliceVisiteCreatePage } from '../police-visite-create/police-visite-create';
import { Manager } from '../../providers/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';

@Component({
  selector: 'page-legislation',
  templateUrl: 'legislation.html'
})
export class LegislationPage {
  _visites: any[] = [];
  _polices: any[] = [];
  displayed: any;
  loaded = false
  loaded1 = false
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform, 
    public storage: Storage,
    public appNotify: AppNotify,
    public actionsheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public manager: Manager,
    public events: Events,
  ) {
    this.listenToEvents();

  }

  ionViewDidLoad() {
    this.display();
  }


  display() {
    this.storage.get('_displayed').then((data) => {
      this.displayed = data;
      // this.updateSchedule(data);
    })
  }



  listenToEvents() {
    this.events.subscribe('displayed:changed', (data) => {
      this.displayed = data;
      this.updateSchedule(data);
    });
    let event: any[] = [
      'visite:deleted',
      'police:deleted',
    ];
    event.forEach(element => {
      this.events.subscribe(element, () => {
        this.updateSchedule(this.displayed);
      });
    });

  }

  updateSchedule(data) {
    this.manager.getPoliceAssurance(data.id).then((police) => {
      this.displayed.police = police;
      this.loaded1 = true;
      this.joursRestant(this.displayed.police);
      this.duree(this.displayed.police);
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
    this.manager.getVisiteTechnique(data.id).then((visite) => {
      this.displayed.visite = visite;
      this.loaded = true;
      this.joursRestant(this.displayed.visite);
      this.duree(this.displayed.visite);
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
  }




  joursRestant(objet: any) {
    if (!objet)
      return;
    let diffDays = Math.ceil((new Date(objet.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    objet.restant = diffDays;
    this.setColorIcon(objet);
  }

  duree(objet: any) {
    if (!objet)
      return;
    let diffDays = Math.ceil((new Date(objet.endDate).getTime() - new Date(objet.startDate).getTime()) / (1000 * 3600 * 24));
    objet.duree = diffDays;
  }



  setColorIcon(objet: any) {
    let n = objet.restant;
    if (n >= 0 && n < 3) {
      objet.color = "primary";
      objet.icon = "ios-warning-outline";
      return;
    }
    else if (n >= 3 && n < 15) {
      objet.color = "orange";
      objet.icon = "ios-warning";
      return;
    }
    objet.color = "danger";
  }

  renouvellerPolice() {
    let modal = this.modalCtrl.create(PoliceVisiteCreatePage, { objet: 'police', displayed: this.displayed });
    modal.present();
  }


  renouvellerVisite() {
    let modal = this.modalCtrl.create(PoliceVisiteCreatePage, { objet: 'visite', displayed: this.displayed });
    modal.present();
  }

  modifierPolice() {
    let modal = this.modalCtrl.create(PoliceVisiteCreatePage, { objet: 'police', entity: this.displayed.police });
    modal.present();
  }


  modifierVisite() {
    let modal = this.modalCtrl.create(PoliceVisiteCreatePage, { objet: 'visite', entity: this.displayed.visite });
    modal.present();
  }



  findToEdit(list: any[], entity: any): any {
    return list.find((el) => {
      return el.id == entity.id;
    });
  }



  openMenu(objet: any) {

    let actionSheet = this.actionsheetCtrl.create({
      title: 'Que Voulez-vous faire ?',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: objet == 'police' ? "Modifier la police d'assurance" : 'Modifier la viste technique',

          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            switch (objet) {
              case 'police':
                this.modifierPolice();
                break;

              default:
                this.modifierVisite();
                break;
            }
          }
        },
        {
          text: objet == 'police' ? "Renouveller la police d'assurance" : 'Renouveller la viste technique',

          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            switch (objet) {
              case 'police':
                this.renouvellerPolice();
                break;

              default:
                this.renouvellerVisite();
                break;
            }

          }
        },
        {
          text: 'Ne rien faire',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



  showConfirm(objet: any) {
    let confirm = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Voulez-vous vraiment annuler' + objet == 'p' ? "la police d'assurance" : 'la viste technique ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OUI',
          handler: () => {
            if (objet == 'p')
              this.manager.delete('police', this.displayed.police).then(data => {
                if (data.success)
                  this.appNotify.onSuccess({ message: "Police supprimée" })
              })
            else
              this.manager.delete('visite', this.displayed.visite).then(data => {
                if (data.success)
                  this.appNotify.onSuccess({ message: "Visite supprimée" })
              })
          }
        }
      ]
    });
    confirm.present();
  }
}
