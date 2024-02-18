import { Component, EventEmitter, Input, Output } from '@angular/core';
//import * as RNBO from '@rnbo/js';

import {NumberParameter, EnumParameter} from '@rnbo/js';
import { MatSliderDragEvent} from '@angular/material/slider';
import { MatRadioChange} from '@angular/material/radio';

@Component({
  selector: 'app-parameter-ui',
  template: `
  <div class="parameter-label-container">
      <label class="parameter-value-label">{{parameter.id}}</label>
    </div>
<mat-slider
        *ngIf="parameter.type === 0"
        class="parameter-number-slider"
        [max]="parameter.max"
        [min]="parameter.min"
        [step]="stepSize" 
        [discrete]="!isNormalized"
        [showTickMarks]="isNormalized ?? false"
        [displayWith]="formatLabel"
        >
      <input matSliderThumb  (dragEnd)="updateParameterValue($event)">
    </mat-slider>
<mat-radio-group *ngIf="parameter.type === 5" (change)="updateParameterValue($event)">

<mat-radio-button class="parameter-enum-radio-button" *ngFor="let enumValue of enumValues" [value]="parameter.value">
    {{enumValue}}
  </mat-radio-button>
</mat-radio-group>`,
  //templateUrl: './rnbo-device.component.html',
  styleUrls: ['./parameter-ui.component.scss']
})
export class ParameterUI {
  @Input() device_id: string
  @Input() precision: number; // number of decimal places in the value. 
 // @Input() device_name: string;
  @Input() parameter: (NumberParameter|EnumParameter);
  @Input() isNormalized?: boolean|undefined;
  @Output() update: EventEmitter<number> = new EventEmitter();
  constructor() { }
  formatLabel(value: number): string {
    let scale = Math.pow(10, this.precision ?? 1);    
    if(this.isNormalized) {
      return `${Math.round(value*scale)/scale}${this.parameter?.unit ?? ''}`;
    }
    else {
      return `${Math.round(value*scale)/scale}${this.parameter?.unit ?? ''}`;
    }

  }
  updateParameterValue(evt: MatSliderDragEvent|MatRadioChange) {
    console.log(`parameter changed too ${evt.value}`);
    this.update.emit(evt.value);
  }
  // convert from RNBO NumSteps to AngularMaterial StepSize
  get stepSize() {
   
    if(this.parameter.steps) {
      return this.parameter.steps/(this.parameter.max - this.parameter.min)
    }
    else {
      // min precision is 0, i.e. a boolean treated as a number
      // max precision is the max precision for a float32
      return Math.pow(10, -this.precision);
    }
  }
  get enumValues() {
    if(this.parameter instanceof EnumParameter) {
      return this.parameter.enumValues;
    }
    return [];
  }
}
