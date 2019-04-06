import {  Directive, Input } from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { Events } from 'ionic-angular';
@Directive({
  selector: '[last-reparation]' // Attribute selector
})
export class LastReparationDirective {
  @Input()
  displayed: any;
  @Input()
  operation: any;
  constructor(
    public events: Events,
    public manager: Manager,
    public appNotify: AppNotify,   
  ) {}

  ngOnChanges() {
    if (!this.displayed)
          return;
    this.manager.getReparation(this.displayed.id,this.operation.id).then((data) => {
      this.operation.lastReparation = data;
      this.operation.loaded = true;
      this.distance(this.operation);
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })

  }


  ngOnInit() {
    this.events.subscribe('releve:created', () => {  
      this.operation.loaded = false;    
      this.ngOnChanges();
    });  
    this.ngOnChanges();
  }



  distance(operation: any) {
   if (!this.displayed)
      return;
    operation.kmt = this.displayed && operation.lastReparation && this.displayed.lastReleve ? (this.displayed.lastReleve.km - operation.lastReparation.km) : null;
    operation.kmrt = operation.kmt != null ? (operation.lastReparation.duree - operation.kmt) : -1;
  }

}
