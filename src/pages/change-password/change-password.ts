import { Component } from '@angular/core';
import { NavController  ,ViewController,} from 'ionic-angular';
import { CompteService} from '../../providers/compte-service';
import {AppNotify} from '../../app/app-notify';
import firebase from 'firebase';
/*
  Generated class for the ChangePassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  user :any={};
  submitted = false;
  round: boolean;
  expand: boolean;
  constructor(
    public navCtrl: NavController,
    public compteService:CompteService,
    public appNotify: AppNotify,
    public viewCtrl: ViewController
    ) {}

  onSubmit() {
  	this.submitted = true;
     console.log( JSON.stringify(this.user));

  	
}


 noMatch() {
    return this.user.password && this.user.repassword &&this.user.repassword!=this.user.password ;  
  } 

   setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

isInvalid() {
      return !this.user.password ||this.noMatch();
  }

resetPassword(email: string) {
  return firebase.auth().sendPasswordResetEmail(email);
}  

}
