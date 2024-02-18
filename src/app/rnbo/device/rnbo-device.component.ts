import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as RNBO from '@rnbo/js';
import {  RnboLoaderService } from '../../services/rnbo/rnbo-loader.service';
import { RnboEventHubService } from '../../services/rnbo/rnbo-event-hub.service';



interface MessageForm {
  inport: string;
  payload: number | number[];
}
@Component({
  selector: 'app-rnbo-device',
  template: `
    <h3>{{ id }}</h3>
    <div class="device-ui" *ngIf="loaded">
      <div
        class="device-parameter-container"
        *ngFor="let parameter of params; let i = index"
      >
        <app-parameter-ui
          [device_id]="id"
          [parameter]="parameter"
          [precision]="4"
          [isNormalized]="false"
          (update)="updateParameter($event, i)"
        ></app-parameter-ui>
      </div>
      <div class="device-inport-container">
        <app-inport-ui
          [device_id]="id"
          [inportInfo]="inports"
          (send)="sendMessage($event)"
        >
        </app-inport-ui>
      </div>
    </div>
    <div id="testButton">
      <button (click)="doTest()">test</button>
    </div>
  `,
  //templateUrl: './rnbo-device.component.html',
  styleUrls: ['./rnbo-device.component.scss'],
})
export class RnboDeviceComponent implements OnChanges {
  @Input() id: string = '';
  device: RNBO.BaseDevice;
  loaded: boolean = false;
  merger?: ChannelMergerNode;
  splitter?: ChannelSplitterNode;
  constructor(
    private rnboLoader: RnboLoaderService,
    private rnboHub: RnboEventHubService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    let idChange = changes?.id;
    if ((idChange)&&((idChange.currentValue!==idChange.previousValue)||(idChange.firstChange))) {
      this.updateDevice(changes['id'].currentValue);
    }
  }
  async updateDevice(newID: string) {
    this.id = newID;
    this.device = (await this.rnboLoader.loadDevice(this.id, {'logDevice': true, 'logPatcher': true}) as RNBO.BaseDevice);
    this.rnboHub.addEventHandler(this.id, this.device, "message", 
    ((evt) => {
      console.log(`received outport message`);
      console.log(evt);
    } 
    ));
    this.loaded = true;
    this.cdRef.detectChanges();
  }
  // Reroute this event handling the the evnet-hub service once timing is enabled
  updateParameter(valueChangeEvent: number, parameterIndex: number) {
    if (this?.device?.numParameters > parameterIndex) {
      console.log(`setting parameter ${parameterIndex} to ${valueChangeEvent}`);
      this.device.parameters[parameterIndex].value = valueChangeEvent;
    }
  }
  sendMessage(evt: MessageForm) {
    let msgEvt = new RNBO.MessageEvent(RNBO.TimeNow, evt.inport, evt.payload);
    this.device.scheduleEvent(msgEvt);
  }
  get params(): RNBO.Parameter[] {
    return this?.device?.parameters ?? [];
  }
  get inports(): RNBO.MessageInfo[] {
    return this?.device?.inports ?? [];
  }
  get buf_ids(): string[] {
    return this.device.dataBufferDescriptions.map((dBD: RNBO.ExternalDataInfo) => dBD.id);
  }
  doTest() {
    console.log('doing test');
  }
}