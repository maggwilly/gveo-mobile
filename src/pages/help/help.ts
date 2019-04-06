import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Read} from '../../providers/read';
/*
  Generated class for the Help page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage  implements OnInit{
  help;
constructor(public navCtrl: NavController,public read:Read) {
    this.read.getHelp()
       .then(res=>{
           this.help=res;
       }); 
  }

ngOnInit(){
     	
}

  ionViewDidLoad() {
    console.log('Hello HelpPage Page');
  }

}
