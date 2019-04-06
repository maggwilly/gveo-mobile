import { Component } from '@angular/core';
import { Events,  NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { DatePipe } from "@angular/common";
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
/*
  Generated class for the PoliceVisiteCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-police-visite-create',
  templateUrl: 'police-visite-create.html'
})
export class PoliceVisiteCreatePage {
  entity: any = {};
  objet: any;
  action: any;
  devise = "XAF";
  lang = "fr";
  submitted = false;
  round: boolean;
  expand: boolean;
  displayed: any;
  spinnerColor: string;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthService,
    public appNotify: AppNotify,
    public storage: Storage,
    public events: Events,
    public manager: Manager, ) {
    this.lang = this.auth.getLang();
    this.devise = this.auth.getDevise();
    this.objet = this.navParams.get('objet');
    this.displayed = this.navParams.get('displayed');
    let nowDate = new Date();
    let datePipe = new DatePipe('en');
    if (!this.navParams.get('entity')) {
      this.action ='create';
      this.entity.startDate = datePipe.transform(nowDate, 'yyyy-MM-dd');
      this.entity.endDate = datePipe.transform(nowDate, 'yyyy-MM-dd');
    }
    else {
      this.action = 'edit';
      this.entity = this.navParams.get('entity');
      this.entity.startDate = datePipe.transform(this.entity.startDate, 'yyyy-MM-dd');
      this.entity.endDate = datePipe.transform(this.entity.endDate, 'yyyy-MM-dd');
    }
  }



  setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }


  isInvalid() {
    return (!this.entity.startDate || !this.entity.cout || !this.entity.endDate);
  }


  onSubmit() {
    this.submitted = true;

    switch (this.objet) {
      case 'police':
      switch (this.action) {
        case 'create':
          this.entity.vehicule = this.displayed.id;
          this.manager.create('police',this.entity).then((data) => {
            this.events.publish('police:created');
            this.displayed.police=data;
            this.appNotify.onSuccess({ message: 'Enrégistrement effectué !' });
            this.dismiss(this.entity);
          }, error => {
            this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
          })
          break;
        default:
          this.manager.update('police',this.entity).then(() => {
            this.events.publish('police:update');
            this.submitted = false;
            this.appNotify.onSuccess({ message: 'Enrégistrement effectué !' });
          }, error => {
            this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
          })       
          break;
      }
        break;
      default:
        switch (this.action) {
          case 'create':
            this.entity.vehicule = this.displayed.id;
            this.manager.create('visite', this.entity).then((visite) => {
              this.events.publish('visite:created');
              this.displayed.visite = visite;
              this.appNotify.onSuccess({ message: 'Enrégistrement effectué !' });
              this.dismiss(this.entity);
            }, error => {
              this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
            })

          break;
        default:
            this.manager.update('visite',this.entity).then(() => {
              this.events.publish('visite:update');
              this.appNotify.onSuccess({ message: 'Enrégistrement effectué !' });
             
            }, error => {
              this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
            })

          break;
      }

        break;
    }

  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Voulez-vous vraiment supprimer ?',
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
            this.submitted = true;
            this.entity.deleted = true;
            return this.manager.delete(this.objet,  this.entity).then(data=>{
              this.appNotify.onSuccess({ message: this.objet+ " supprimée" })
              this.dismiss();
          },error=>{
            this.appNotify.onSuccess({ message: "Une erreur s'est produite " })
          }) 
            
          }
        }
      ]
    });
    confirm.present();
  }
}
