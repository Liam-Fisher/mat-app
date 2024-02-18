import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PkdxTableComponent } from './ui/pkdx-table/pkdx-table.component';
// Material Components
//import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PkdxDisplayComponent } from './display/pkdx-display.component';
import { PkmnViewComponent } from './ui/pkmn-view/pkmn-view.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { PkmnTeamComponent } from './ui/pkmn-team/pkmn-team.component';

@NgModule({
  declarations: [
    PkdxTableComponent,
    PkdxDisplayComponent,
    PkmnViewComponent,
    PkmnTeamComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule
  ],
  exports: [PkdxDisplayComponent]
})
export class PkmnModule { }
