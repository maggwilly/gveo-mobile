import { Component } from '@angular/core';
import {  NavController, NavParams,ModalController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-processing',
  templateUrl: 'processing.html',
})
export class ProcessingPage {
 expanded: any;
 contracted: any;
 showIcon = true;
  timeout: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public menu: MenuController,
    public modalCtrl: ModalController) {
      this.menu.enable(true)
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.timeout = true;
    }, 40000);
  }

  expand() {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;
  
  }

 
}
