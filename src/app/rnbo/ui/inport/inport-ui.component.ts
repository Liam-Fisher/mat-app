import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
import * as RNBO from '@rnbo/js';

interface MessageForm {
  inport: string
  payload: number|number[]
}
// other UI...
// preset
// audio graph
// midi



@Component({
  selector: 'app-inport-ui',
  template: `
  <form [formGroup]="messageForm">
  <mat-form-field> 
  <mat-label>Inport Name</mat-label>
  <mat-select required formControlName="inport">
    <mat-option *ngFor="let tag of tags" [value]="tag">
      {{tag}}
    </mat-option>
  </mat-select>
  </mat-form-field>
  <mat-form-field class="message-input">
    <mat-label>message</mat-label>
    <input matInput formControlName="payload">
  </mat-form-field>
  <button mat-button (click)="sendMessage()">Send</button>
</form>
  `,
  styleUrls: ['./inport-ui.component.scss']
})
export class InportUI implements OnInit {
  @Input() device_id: string
  @Input() inportInfo: RNBO.MessageInfo[] = [];
  @Output() send: EventEmitter<MessageForm> = new EventEmitter();
  
  //@Output() send: EventEmitter<[string, ...number[]]> = new EventEmitter();
  messageForm: FormGroup
  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.messageForm = this.fb.group({
      inport: '',
      payload: ''
    });
  }
  logNum() {
    let nums = this.payload?.value.split(' ').map((n: string) => +n);
    console.log(nums.length);
    nums.forEach((num: number|string) => {
    console.log(typeof num);
    console.log(num);
});
  }
  get selected() {
    return this.messageForm.get('inport');
  }
  get payload() {
    return this.messageForm.get('payload');
  }
  get tags() {
    return this.inportInfo.map((m) => m.tag);
  }
  sendMessage() {
    console.log(this.messageForm.value);
    let evt: MessageForm = {
      inport: this.selected?.value,
      payload: this.payload?.value.split(' ').map((n: string) => +n)
    };
    this.send.emit(evt);
  }
}
