import { NgModule } from '@angular/core';
import { LastReleveDirective } from './last-releve/last-releve';
import { LastReparationDirective } from './last-reparation/last-reparation';
import { LisfOfMaintenanceDirective } from './lisf-of-maintenance/lisf-of-maintenance';
import { LastPoliceDirective } from './last-police/last-police';
import { LastVisiteDirective } from './last-visite/last-visite';
import { StatisticDirective } from './statistic/statistic';
import { TodoDirective } from './todo/todo';
@NgModule({
	declarations: [LastReleveDirective,
    LastReparationDirective,
    LisfOfMaintenanceDirective,
    LastPoliceDirective,
    LastVisiteDirective,
    StatisticDirective,
    TodoDirective],
	imports: [],
	exports: [LastReleveDirective,
    LastReparationDirective,
    LisfOfMaintenanceDirective,
    LastPoliceDirective,
    LastVisiteDirective,
    StatisticDirective,
    TodoDirective]
})
export class DirectivesModule {}
