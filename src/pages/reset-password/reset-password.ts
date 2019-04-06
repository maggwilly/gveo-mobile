import { NavController, AlertController, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { EmailValidator } from '../../validators/email';
import firebase from 'firebase';
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm;
  submitted = false;
  constructor(public authData: AuthService,
     public formBuilder: FormBuilder,
     public menu: MenuController,
    public nav: NavController, 
    public alertCtrl: AlertController) {
      this.menu.enable(true)
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    })
  }

  goToLogin() {
    this.nav.pop();
  }

  resetPassword(){
    this.submitted = true;
    return firebase.auth()
      .sendPasswordResetEmail(this.resetPasswordForm.value.email)
      .then((user) => {
        let alert = this.alertCtrl.create({
          message: "We just sent you a reset link to your email",
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => {
                this.nav.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        this.submitted = false;
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        errorAlert.present();
      });;
  }

  isInvalid() {
    return !this.resetPasswordForm.valid

  }
}