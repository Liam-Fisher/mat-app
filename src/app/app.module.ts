// Angular Required
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Angular Common
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
// Modules
import { RnboModule } from './rnbo/rnbo.module';
import { PkmnModule } from './pkmn/pkmn.module';
// Material
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { PathInputCanvasComponent } from './path-input-canvas/path-input-canvas.component';
import { PkmnWaapiComponent } from './pkmn-waapi/pkmn-waapi.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeMenuComponent,
    PathInputCanvasComponent,
    PkmnWaapiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RnboModule,
    PkmnModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
