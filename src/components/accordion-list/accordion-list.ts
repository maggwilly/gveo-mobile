import { Component, ElementRef, Input, Renderer, ViewChild,} from '@angular/core';
import {Events,  ModalController , NavController} from 'ionic-angular';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
import { PrevisionPage } from '../../pages/prevision/prevision';
@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {
  @Input() headerColor: string = '#F53D3D';
  @Input() textColor: string = '#065C79F';
  @Input() contentColor: string = '#FFF';
  @Input() hasMargin: boolean = true;
  @Input() displayed: any;
  @ViewChild('accordionContent') elementView: ElementRef;
  expanded: boolean = false;
  viewHeight: number;
  loaded:boolean=true;
  constructor(
     public renderer: Renderer,
     public manager: Manager,
     public appNotify: AppNotify, 
     public events: Events,
     public navCtrl: NavController,
     public modalCtrl: ModalController) { 
       this.events.subscribe('reparation:created',(data)=>{
          this.findRemove(data)
       })
  }

findRemove(op:any){
  
  if(!this.displayed.todos||!this.displayed.todos.length)
     return
 let index:number= this.displayed.todos.findIndex(item=> {return (op.vehicule == this.displayed.id)&&(item.id == op.id)});
 return this.displayed.todos.splice(index,1)
}

  ngAfterViewInit() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;
    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', 0 + 'px');    
  }


  ngOnInit() {
    this.loaded=false;
    this.manager.getTodos(this.displayed.id ? this.displayed.id : 0).then((data) => {
      this.displayed.todos = data ? data : [];
      this.loaded=true;
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
    const newHeight = this.expanded ? '100%' : '0px';
    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', newHeight);
  }
  
  creerPrevision(operation:any) {
    let modal = this.modalCtrl.create(PrevisionPage, { operation:operation, displayed: this.displayed });
    modal.present();
  }


  showPrevision(operation:any) {
    this.navCtrl.push(PrevisionPage, { operation: operation, displayed: this.displayed  });
  }
}
