import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Manager} from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PiecesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pieces',
  templateUrl: 'pieces.html',
})
export class PiecesPage {
   pieces:any[]=[]
   systeme:any;
   queryText: string;
   loaded=false;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public manager: Manager,
    public appNotify: AppNotify,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
      this.systeme=this.navParams.get('systeme');
  }

  ionViewDidLoad() {
        this.storage.get(this.systeme+'_pieces').then((data) => {
        this.pieces = data?data:[];
        this.loaded=true;
        this.manager.getEntity('Piece',this.systeme)
    .then(data => {  
        this.pieces = data?data:[];
        this.storage.set(this.systeme+'_pieces', this.pieces);
    }, error => {
        this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    });
    });
    }
  
   dismiss(data?:any) {
     this.viewCtrl.dismiss();
   }
  
   onSelect(piece:any) {
      this.viewCtrl.dismiss(piece);
   }  

   search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.pieces.forEach(item => {
    item.hide = true;
    this.filter(item, queryWords);
 });

}
filter(item, queryWords){
let matchesQueryText = false;
if (queryWords.length) {
 // of any query word is in the session name than it passes the query test
 queryWords.forEach(queryWord => {
   if (item.nom&&item.nom.toLowerCase().indexOf(queryWord) > -1 ) {
     matchesQueryText = true;
   }
 });
} else {
 // if there are no query words then this session passes the query test
 matchesQueryText = true;
}
item.hide = !(matchesQueryText );
}
}
