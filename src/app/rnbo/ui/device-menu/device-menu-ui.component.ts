import { Component, EventEmitter,Input, Output } from '@angular/core';




@Component({
  selector: 'app-source-device-selection-menu',
  template: `
    <button mat-button id= "device-selection-menu-trigger" [matMenuTriggerFor]="menu">Menu</button>
<mat-menu #menu="matMenu" >
  <div class="device-selection-button-container" *ngFor="let device_id of deviceList">
  <button mat-menu-item (click)="selectDevice(device_id)">{{device_id}}</button>
  </div>
</mat-menu> 
  `,
  styleUrls: ['./device-menu-ui.component.scss']
})
export class SourceDeviceSelectionMenuComponent {

  @Input() deviceList: string[] | null;
  @Output() deviceSelected: EventEmitter<string> = new EventEmitter();
constructor() { }
  selectDevice(id: string) {
    this.deviceSelected.emit(id);
  }
  
}
