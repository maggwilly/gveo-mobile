import { Directive, Input } from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';

/*
  Generated class for the LastReleveDirective directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[last-releve]' // Attribute selector
})
export class LastReleveDirective {
  @Input()
  displayed: any;
  constructor(
    public manager: Manager,
    public appNotify: AppNotify,
  ) {
    console.log('Hello LastReleveDirective Directive');
  }

  ngOnChanges() {
    if (!this.displayed)
      return;
    this.manager.getReleve(this.displayed.id).then((data) => {
      this.displayed.lastReleve = data ;
      this.getColor(this.displayed.lastReleve);
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })

  }


  ngOnInit() {
    this.ngOnChanges();
  }

  getColor(obj) {
    if (!obj)
      return
    let relevDate = obj.dateSave;
    let relevTime = new Date(relevDate).getTime();
    let now = Date.now();
    if (!relevDate || (now - relevTime) > 5 * 24 * 3600 * 1000) {
      obj.color = 'danger'
      return 'danger';
    }
    obj.color = 'secondary'
    return 'secondary';
  }
}
