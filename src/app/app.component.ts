import { Component, ViewChild, NgZone } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events, Platform, MenuController, Nav, AlertController, ModalController, LoadingController, Loading, App } from 'ionic-angular';
import { AuthService } from '../providers/auth-service';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { SettinsPage } from '../pages/settings/settings';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ProcessingPage } from '../pages/processing/processing'
import { Manager } from '../providers/manager';
import { VehiculeCreatePage } from '../pages/vehicule-create/vehicule-create';
import { ExpirePagePage } from '../pages/expire/expire';
import { Storage } from '@ionic/storage';
import { FcmProvider } from '../providers/fcm/fcm';
import { AppNotify } from '../app/app-notify';
import { CompteService } from '../providers/compte-service';
import { StatPage } from '../pages/stat/stat';
import { AccordionListPage } from '../pages/accordion-list/accordion-list';
import { firebaseConfig } from './firebaseconfig';
import firebase from 'firebase/app';
const appVersion = '1.2.8';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = ProcessingPage;
  _vehicules: any = [];
  _releves: any[] = [];
  notificationId: string
  registrationId = window.localStorage.getItem('registrationId');
  queryText = '';
  authinfo = false
  zone: NgZone;
  loading: any;
  rootSet: boolean = false;
  abonnement: any;
  constructor(
    public platform: Platform,
    public events: Events,
    public auth: AuthService,
    public manager: Manager,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    private fcm: FcmProvider,
    public compteService: CompteService,
    public appNotify: AppNotify,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public storage: Storage,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    firebase.initializeApp(firebaseConfig);
    this.notificationId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : undefined;
    this.zone = new NgZone({});
    platform.ready().then(() => {
      this.listenToEvent();
      statusBar.backgroundColorByHexString("#065C79");
      splashScreen.hide();
      this.registerForNotification();
    });
  }

  registerForNotification() {
    /* this.fcm.getToken().then(token => {
           this.registrationId=token;
           window.localStorage.setItem('registrationId', token)
 
          });
          this.fcm.onTokenRefresh().subscribe(token => {
            this.registrationId=token;
              window.localStorage.setItem('registrationId', token)
          });
          this.fcm.onNotification().subscribe(data => {
            if (data.tap) {
              if (data.vehicle) {
                let vehicule = {
                  id: data.vehicle,
                  matricule: data.matricule,
                  coutAchat: data.coutAchat,
                  index0: data.index0,
                  chauffeur: data.chauffeur
                }
                this.rootSet=true;
                this.checkConnected({ vehicule: vehicule, tab: data.tab});
              }
            }
          });
          if (!this.rootSet)*/
    this.checkConnected().then((user: any) => {
      if (!user || !window.localStorage.getItem('registrationId'))
        return
      this.registration(window.localStorage.getItem('registrationId'), user.uid);
    });
  }



  setRoot(page: any = {}) {
    this.menu.close();
    switch (page) {
      case 'settings':
        this.nav.push(SettinsPage);
        break;
      case 'create':
        if (this.isExpired(this.abonnement)) {
          let modal = this.modalCtrl.create(ExpirePagePage, { abonnement: this.abonnement })
          modal.present();
          return;
        }
        if (this.abonnement.nbervehicule <= this._vehicules.length) {
          let modal = this.modalCtrl.create(ExpirePagePage, { abonnement: this.abonnement })
          modal.present();
          return;
        }
        let modal = this.modalCtrl.create(VehiculeCreatePage);
        modal.onDidDismiss(data => {
          if (data) {
            this._vehicules.push(data);
            this.select(data);
            //todo
          }
        });
        modal.present();
        break;
      default:
        this.nav.setRoot(TabsPage);
        break;
    }
  }

  openStat() {
    this.appCtrl.getRootNav().push(StatPage)
  }

  openRecap() {
    this.appCtrl.getRootNav().push(AccordionListPage)
  }



  isExpired(abonnement: any) {
    if (!abonnement)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
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
      queryWords.forEach(queryWord => {
        if (item.matricule.toLowerCase().indexOf(queryWord) > -1 || item.chauffeur.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

  updateSchedule() {
    return this.storage.get('_vehicules').then((data) => {
      this._vehicules = this.avalableList(data);
    }
    )
  }
  organiser(arr: any[]) {
    arr.forEach(element => {
      element.restant = 0;
    });
  }
  avalableList(list: any[]) {
    if (!list)
      return [];
    return list.filter((rep) => {
      return !rep.deleted;
    });
  }

  listenToEvent() {

    let vehiculeEvents: any[] = [
      'vehicule:changed',
      'load:success'
    ];
    vehiculeEvents.forEach(element => {
      this.events.subscribe(element, () => {
        this.updateSchedule();
      });
    });
    let userEvents: any[] = [
      'login:success',
      'user:created',
    ];
    userEvents.forEach(element => {
      this.events.subscribe(element, (loading: Loading) => {
        this.authinfo = true;
        loading.dismiss();
      });
    });


    this.events.subscribe('logout:success', () => {
      this.authinfo = false;
      this.nav.setRoot(SignupPage);

    });
    this.events.subscribe('error', () => {
      this.showError();
    });
    this.events.subscribe('vehicules:list:open', () => {
      this.showVehiculesList();
    });
    this.events.subscribe('releve:created', (releve) => {
      this._releves.push(releve);
    });
  }


  checkConnected(arg?: any) {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        this.zone.run(() => {
          if (!user) {
            this.rootPage = SignupPage
            resolve();
          } else {
            this.authinfo = true;
            this.storage.get("_vehicules").then(data => {
              this._vehicules = data ? data : [];
              this.compteService.getInfo(firebase.auth().currentUser.uid, this.registrationId).then((info) => {
                this.abonnement = info.abonnement;
                if (info && !info.displayName || !info.phone || !info.ville || !info.email || !info.pays)
                  this.profilAlert();
                if (this.isExpired(this.abonnement)) {
                  this.nav.setRoot(ExpirePagePage, { abonnement: this.abonnement });
                  resolve(user);
                  return;
                }
                this.manager.getVehicules(user.uid).then(vehicules => {
                  this._vehicules = vehicules;
                  this.storage.set("_vehicules", vehicules)
                }, error => {
                  this.rootPage = ProcessingPage;
                })
                this.nav.setRoot(TabsPage, arg);
                resolve(user);
              }, error => {
                this.rootPage = ProcessingPage;
              })
            })
          }
        })
      }, error => { });
    })
  }


  showError() {
    let confirm = this.alertCtrl.create({
      title: 'Problème de connexion',
      message: 'Vérifiez votre connexion internet.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.updateSchedule();
          }
        }
      ]
    });
    confirm.present();
  }


  select(vehicule) {
    this.menu.close();
    this.storage.set('_displayed', vehicule).then(() => {
      this.events.publish('displayed:changed', vehicule);
      this.appNotify.onSuccess({ message: "Changement de véhicule effectué" })
    });
  }



  showVehiculesList() {
    this.menu.open();
  }



  isReleveExpired(displayed: any) {
    let relevDate = displayed.lastReleve ? displayed.lastReleve.dateSave : null;
    let relevTime = new Date(relevDate).getTime();
    let now = Date.now();
    if (!relevDate || (now - relevTime) > 5 * 24 * 3600 * 1000)
      return true;
    return false;

  }


  registration(registrationId: any, info?: any) {
    this.registrationId = registrationId;
    console.log(registrationId);

    if (!registrationId || registrationId == 'null')
      return
    this.manager.update('registration', { id: registrationId, registrationId: registrationId, appVersion: appVersion, info: info }).then((data) => {
    }, error => {
      this.appNotify.onError({ message: 'problème de connexion.' });
    })
  }

  profilAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Vos informations',
      message: "Vous devez completer votre profil utilisateur afin que nous puissions vous identifier",
      buttons: [

        {
          text: 'Completer',
          handler: () => {
            this.nav.push(EditProfilePage);
          }
        }

      ]
    });
    confirm.present();
  }
}

