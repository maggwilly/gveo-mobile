import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PiecesPage } from './pieces';

@NgModule({
  declarations: [
    PiecesPage,
  ],
  imports: [
    IonicPageModule.forChild(PiecesPage),
  ],
})
export class PiecesPageModule {}
