import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AppNotify } from './app-notify';
import { SystemesPage } from '../pages/systemes/systemes';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SelectPage } from '../pages/select/select';
import { CompteService } from '../providers/compte-service';
import { PrevisionPage } from '../pages/prevision/prevision';
import { PrevisionCreatePage } from '../pages/prevision-create/prevision-create';
import { PoliceVisiteCreatePage } from '../pages/police-visite-create/police-visite-create';
import { VehiculeCreatePage } from '../pages/vehicule-create/vehicule-create';
import { ReparationCreatePage } from '../pages/reparation-create/reparation-create';
import { ReparationListPage } from '../pages/reparation-list/reparation-list';
import { AboutPage } from '../pages/about/about';
import { HelpPage } from '../pages/help/help';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { SettinsPage } from '../pages/settings/settings';
import { UtilisationPage } from '../pages/utilisation/utilisation';
import { LegislationPage } from '../pages/legislation/legislation';
import { MarquesPage } from '../pages/marques/marques';
import { HeaderComponent } from '../components/header/header'
import { AccordionListComponent } from '../components/accordion-list/accordion-list'
import { AccordionListPage } from '../pages/accordion-list/accordion-list'
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { Http, HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../providers/auth-service';
import { FcmProvider } from '../providers/fcm/fcm';
import { Manager } from '../providers/manager';
import { IonicStorageModule } from '@ionic/storage';
import { ExpirePagePage } from '../pages/expire/expire';
import { ProcessingPage } from '../pages/processing/processing'
import { RecapPagePage } from '../pages/recap/recap';
import { StatPage } from '../pages/stat/stat';
import { SharedDirectivesModule } from './shared.module';
import { Firebase } from '@ionic-native/firebase/ngx';
import { firebaseConfig } from './firebaseconfig';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const declarations = [
  MyApp,
  AboutPage,
  LoginPage,
  SignupPage,
  SystemesPage,
  HomePage,
  TabsPage,
  SelectPage,
  PrevisionPage,
  PrevisionCreatePage,
  ReparationCreatePage,
  SettinsPage,
  HelpPage,
  EditProfilePage,
  ChangePasswordPage,
  ResetPasswordPage,
  AboutPage,
  ReparationListPage,
  LegislationPage,
  UtilisationPage,
  PoliceVisiteCreatePage,
  VehiculeCreatePage,
  MarquesPage,
  HeaderComponent,
  ExpirePagePage,
  RecapPagePage,
  ProcessingPage,
  AccordionListComponent,
  StatPage,
  AccordionListPage
];
@NgModule({
  declarations: declarations,
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    TooltipsModule.forRoot(),
    BrowserAnimationsModule,
    HttpModule, TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
    ,
    SharedDirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: declarations,
  providers: [
    StatusBar,
    SplashScreen, Firebase,
    AuthService, Manager, AppNotify, CompteService, FcmProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}