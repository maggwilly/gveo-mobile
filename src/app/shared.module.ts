
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LastPoliceDirective } from '../directives/last-police/last-police';
import { LastReleveDirective } from '../directives/last-releve/last-releve';
import { LastVisiteDirective } from '../directives/last-visite/last-visite';
import { LastReparationDirective } from '../directives/last-reparation/last-reparation';
import { LisfOfMaintenanceDirective } from '../directives/lisf-of-maintenance/lisf-of-maintenance';
import { StatisticDirective } from '../directives/statistic/statistic';
import { TodoDirective } from '../directives/todo/todo';
@NgModule({
  declarations: [
    LastPoliceDirective,
    LastReleveDirective,
    LastVisiteDirective,
    LastReparationDirective,
    LisfOfMaintenanceDirective,
    StatisticDirective,
    TodoDirective
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    LastPoliceDirective,
    LastReleveDirective,
    LastVisiteDirective,
    LastReparationDirective,
    LisfOfMaintenanceDirective,
    StatisticDirective,
    TodoDirective
  ]
})

export class SharedDirectivesModule { }

