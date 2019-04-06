import { Component } from '@angular/core';
import { Events, ModalController, NavController, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { CompteService } from '../../providers/compte-service';
import { LoginPage } from '../login/login';
import { AppNotify } from '../../app/app-notify';
import firebase from 'firebase';
import {

  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
//import { User} from '../model/user';
/*
  Generated class for the Signup page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [AppNotify]
})
export class SignupPage {

  country: any = { code: '237', nom: 'Cameroun', 'countryCode': 'CM' };
  submitted = false;
  round: boolean;
  stape = 'email';
  expand: boolean;
  spinnerColor: string;

  public newUser: FormGroup;
  public nom: FormControl;
  public email: FormControl;
  public plainPassword: FormControl;
  public passwordConfirm: FormControl;
  public error: any;
  loading;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authService: CompteService,
    public menu: MenuController,
    public events: Events,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public appNotify: AppNotify) {
    this.menu.enable(true)
    // @todo add better email-validation pattern...
    this.email = new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"),
    ]));

    this.plainPassword = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(24)
    ]));

    this.passwordConfirm = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(24),
    ]));

    this.newUser = this.formBuilder.group({
      email: this.email,
      plainPassword: this.plainPassword,
      passwordConfirm: this.passwordConfirm,
    })
  }




  ionViewDidLoad() {
    console.log('Hello Signup Page');
  }


  onSubmit() {
    this.submitted = true;
    this.loading = this.loadingCtrl.create({});
    this.loading.present();
    return firebase.auth().createUserWithEmailAndPassword(this.newUser.value.email, this.newUser.value.plainPassword)
      .then((newUser:any) => {
        firebase.database().ref('/userProfile/' + newUser.uid).child('info')
          .set({ email: this.newUser.value.email, langue: 'fr', devise: 'XAF', createAt: Date.now() }).then(() => {
            this.events.publish('user:created', this.loading);
          });
      }).catch((error) => {
        this.error = error;
        this.appNotify.onError({ message: this.error.message || this.error });
        let errorAlert = this.alertCtrl.create({
          message: this.error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        this.loading.dismiss().then(() => {
          errorAlert.present();
        });
        this.plainPassword.setValue('');
        this.passwordConfirm.setValue('');
        this.submitted = false;
      });
  }

  nextStape() {
    switch (this.stape) {
      case 'email':
        /*   this.stape='nom';
        break; 
   case 'nom':*/
        this.stape = 'password';
        break;
      default:
        break;
    }

  }

  previewStape() {
    switch (this.stape) {

      case 'password':
        /*   this.stape='nom';
        break; 
   case 'nom':*/
        this.stape = 'email';
        break;
      default:
        break;
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
    switch (this.stape) {
      case 'email':
        return !this.email.valid;
      case 'password':
        return !this.newUser.valid || (this.passwordConfirm.value !== this.plainPassword.value);
      /* case 'nom':
              return !this.nom.valid;     */
    }

  }

  login() {
    this.navCtrl.push(LoginPage);
  }


}