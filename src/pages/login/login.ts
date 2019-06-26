import { Component } from '@angular/core';
import { Events, NavController, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SignupPage } from '../signup/signup';
import { AppNotify } from '../../app/app-notify';
import { TabsPage } from '../tabs/tabs';
import { ResetPasswordPage } from '../reset-password/reset-password';
import firebase from 'firebase';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { timeout } from 'rxjs/operators';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AppNotify]
})

export class LoginPage {

  submitted = false;
  round: boolean;
  expand: boolean;
  spinnerColor: string;

  public usercreds: FormGroup;
  public login: FormControl;
  public password: FormControl;
  public error: any;
  loading;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public events: Events,
    public formBuilder: FormBuilder,
    public appNotify: AppNotify
  ) {
    this.menu.enable(true)
    this.login = new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"),
    ]));

    this.password = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    this.usercreds = this.formBuilder.group({
      login: this.login,
      password: this.password
    });
  }


  onSubmit() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    return firebase.auth().signInWithEmailAndPassword(this.usercreds.value.login, this.usercreds.value.password).then(() => {
      //this.loading.dismiss();
        this.events.publish('login:success',this.loading);
    })
      .catch((error) => {
        this.error = error;
        this.appNotify.onError({ message: this.error.message || this.error });
        this.password.setValue('');
        this.submitted = false;
        this.loading.dismiss();
      });
  }

  goToResetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }


  isInvalid() {
    return !this.usercreds.valid

  }

  setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

  authSuccess() {
    this.spinnerColor = 'danger';
    this.expand = true;
    setTimeout(() => {
      this.navCtrl.setRoot(TabsPage);
    }, 300)

  }

  authError() {

    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'Could not authenticate user',
      buttons: ['OK']
    });
    alert.present();

    this.submitted = false;
    this.round = false;

  }


  signup() {
    this.navCtrl.push(SignupPage);
  }

}
