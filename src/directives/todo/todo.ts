import { Directive, Input,Output } from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the TodoDirective directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[todo]' // Attribute selector
})
export class TodoDirective {
  @Output()
  isTodos: boolean;
  constructor(public manager: Manager, public appNotify: AppNotify) {
    console.log('Hello TodoDirective Directive');
  }
  ngOnInit() {
    this.manager.isTodos().then((data) => {
      this.isTodos = data;
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })
  }
}
