import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { VehiculeCreatePage} from '../vehicule-create/vehicule-create';
import { Storage } from '@ionic/storage';
import { AuthService} from '../../providers/auth-service';
import { Chart } from 'chart.js';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the Utilisation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-utilisation',
  templateUrl: 'utilisation.html'
})
export class UtilisationPage {
   @ViewChild('doughnutCanvas') doughnutCanvas;
    doughnutChart: any;
    displayed:any;
    devise="XAF";
    lang="fr";
     loaded=false;
     title = 'Statistiques ce mois';
   startDate;
   endDate ;
  periode ='thismonth';
  statstic;
    constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public modalCtrl: ModalController,      
     public events: Events, 
     public auth: AuthService,
      public actionsheetCtrl: ActionSheetController,
      public manager: Manager,
      public appNotify: AppNotify,
      public alertCtrl: AlertController
     ,public storage: Storage
     ) {
       this.lang=this.auth.getLang();
      this.devise=this.auth.getDevise();      
      this.listenToEvents();
      let date = new Date();
  }

  ionViewDidLoad() {
       this.display()
  } 

  resolveAfter() {
    return new Promise(resolve => {
      setInterval(() => {
        if (this.displayed&&this.displayed.statstic)
            resolve(this.displayed.statstic);
      }, 1000);
    });
  }

initChart(){
  console.log(this.statstic);
  
  if(!this.statstic)
        return ;
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ["Maint. préventive", "Maint. Curatives", "Administratives"],
                datasets: [{
                    label: '# dépenses',
                  data: [this.statstic.preventive, this.statstic.cuirative, this.statstic.legislation],
                    backgroundColor: [
                        'rgba(6,92,121,0.9)',
                        'rgba(201, 19, 31, 0.8)',
                        'rgba(80, 202, 19, 0.7)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }
     }); 
}


display(){
 return this.storage.get('_displayed').then((data) =>{  
     this.displayed= data;
   
      this.fethStatistic();
    })
}

  async fethStatistic() {
    this.statstic =  await this.resolveAfter();
    return this.initChart();
  }


  editVehicule(){
    let modal = this.modalCtrl.create(VehiculeCreatePage, { vehicule: this.displayed});
    modal.onDidDismiss(data => {
    
    });
    modal.present();   
  }

 listenToEvents() {
   this.events.subscribe('displayed:changed', (data) => {
      this.displayed = data;
     this.displayed.loaded=false;
     this.fethStatistic();
    });

    this.events.subscribe('devise:changed', () => {
      this.lang=this.auth.getLang();
     this.devise=this.auth.getDevise();  
    });

}

findAndRemove(array:any[],item:any){
array.forEach(element => {
   if(element.id==item.id)
      element.deleted=true;
});
}
  openMenu(objet: any) {

    let actionSheet = this.actionsheetCtrl.create({
      title: 'Afficher les statistic',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Pour ce mois',
          icon: 'md-calendar',
          handler: () => {
            this.title = 'Statistiques ce mois';
            this.periode ='thismonth'
            this.displayed.statstic = undefined;
            this.displayed.loaded = false;
            this.fethStatistic();
          }
        },
        {
          text:'Pour le mois dernier',
          icon: 'md-calendar',
          handler: () => {
            this.title = 'Statistiques mois dernier';
            this.periode = 'lastmonth'
            this.displayed.statstic = undefined;
            this.displayed.loaded = false;
            this.fethStatistic();
          }
        },
        {
          text: 'Pour cette année',
          icon: 'md-calendar',
          handler: () => {
            this.title = 'Statistiques cette année';
            this.periode = 'thisyear'
            this.displayed.loaded = false;
            this.displayed.statstic = undefined;
            this.fethStatistic();
          }
        },  
        {
          text: "Pour l'an dernier",
          icon: 'md-calendar',
          handler: () => {
            this.title = "Statistiques l'an dernier";
            this.periode = 'lastyear'
            this.displayed.statstic = undefined;
            this.displayed.loaded = false;
            this.fethStatistic();
          }
        },
        {
          text: "Entre deux dates",
          icon: 'md-calendar',
          handler: () => {
            this.chooseDates();
           
        }
      },                      
        {
          text: 'Ne rien faire',
          role: 'cancel', // will always sort to be on the bottom
          icon:  'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  chooseDates() {
    let confirm = this.alertCtrl.create({
      title: 'Période',
      message: 'Définissez une période pour afficher les statistiques',
      inputs: [
        {
          name: 'startDate',
          type: 'text',
          placeholder: 'JJ/MM/AAAA',
          value: this.startDate
        }
,
        {
          name: 'endDate',
          type: 'text',
          placeholder: 'JJ/MM/AAAA',
          value:this.endDate
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
          text: 'Afficher',
          handler: data => {
            this.title = "Statistiques " + data.startDate + " - " + data.endDate;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.displayed.statstic=undefined;
            this.displayed.loaded = false;
            this.periode=undefined;
            this.fethStatistic();
          }
        }
      ]
    });
    confirm.present();
  }


}
