import { Directive, Input } from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the StatisticDirective directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[statistic]' // Attribute selector
})
export class StatisticDirective {
  @Input()
  displayed: any;
  @Input()
  periode: any;
  @Input()
  startDate: any;
  @Input()
 endDate: any;
  constructor(public manager: Manager ,public appNotify: AppNotify) {
    console.log('Hello StatisticDirective Directive');
  }
  ngOnChanges() {
    if (!this.displayed)
      return;

    this.manager.getStatistic(this.displayed.id ? this.displayed.id:0, this.startDate, this.endDate,this.periode).then((data) => {
      this.displayed.loaded = true;
      this.displayed.statstic = data;
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
  }


  ngOnInit() {
    this.ngOnChanges();
  }

}
