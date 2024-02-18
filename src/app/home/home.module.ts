import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeMenuComponent } from '../home-menu/home-menu.component';

// Angular Material UI
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';




@NgModule({
  declarations: [
    HomeMenuComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ]
})
export class HomeModule { }
