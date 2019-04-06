import { Directive ,Input} from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the LisfOfMaintenanceDirective directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[lisf-of-maintenance]' // Attribute selector
})
export class LisfOfMaintenanceDirective {
  @Input()
  displayed: any;
  @Input()
  systeme: any;
  constructor(
    public manager: Manager,
    public appNotify: AppNotify,    
  ) {
    console.log('Hello LisfOfMaintenanceDirective Directive');
  }
  ngOnChanges() {
    if (!this.displayed)
      return;
    this.systeme.loaded = false;
    this.manager.getMaintenances(this.displayed.id, this.systeme.id).then((data) => {
      this.systeme.maintenances = data ? data : [];
      this.systeme.loaded=true;
      this.systeme.cout=0;
      this.systeme.maintenances.forEach(maintenance => {
        this.systeme.cout += this.coutTotal(maintenance);
      });
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
  }
  coutTotal(maintenance: any): number {
    let cout = 0;
    return Number(maintenance.cout) + Number(maintenance.coutMainOeuvre);
  }

  ngOnInit() {
    this.ngOnChanges();
  }
}
