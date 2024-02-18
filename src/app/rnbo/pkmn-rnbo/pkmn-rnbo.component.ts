import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import * as RNBO from '@rnbo/js';
import {  RnboLoaderService } from '../../services/rnbo/rnbo-loader.service';
import {Observable,from } from 'rxjs';
import { AudioService } from 'src/app/services/webAPI/audio.service';
import { PkmnService } from 'src/app/services/pkmn.service';
import {} from '@angular/material/input';
import { FormBuilder, FormGroup } from '@angular/forms';

interface MessageForm {
  inport: string;
  payload: number | number[];
}
@Component({
  selector: 'app-pkmn-rnbo',
  templateUrl: './pkmn-rnbo.component.html',
  styleUrls: ['./pkmn-rnbo.component.scss'],
})
export class PkmnRnboComponent implements OnInit {
  @Input() id: string = 'pkmnLoopCount';
  
  panners: Panner[] = [];
  device: RNBO.BaseDevice;
  preload: boolean = true;
  loaded: Observable<boolean> = new Observable();
  deviceList: Observable<string[]>;
  splitter: ChannelSplitterNode;
  testCmd: FormGroup
  constructor(
    private rnboLoader: RnboLoaderService,
    private webAudio: AudioService,
    private pkmnService: PkmnService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  execute() {
    let cmdStr = this.testCmd.get('cmd')?.value;
    if(typeof cmdStr !== 'string') {
      console.log('no command received');
      return;
    }
console.log(`executing command ${this.testCmd.get('cmd')?.value}`);
  let parsed = cmdStr.split(' ');
  let tgt: number;
  let time: number;
    switch (parsed[0]) {
      case 'ramp':
      tgt = +parsed[1];
      time = +parsed[2]
      let val = +parsed[3];
      this.panners[tgt].rampTo(val, time, Boolean(+parsed[4]));
        break;
    
          
        

      
      default:
        console.log(`unknown command ${parsed[0]}`);
        break;
    }
}
  ngOnInit() {
    this.testCmd = this.fb.group({
      cmd: ''
    });

    this.loaded.subscribe((isLoaded: boolean) => {
      if(isLoaded) {
        this.preload = false;
        this.cdRef.detectChanges();
      }
      else {
        throw new Error(`audio context did NOT load`);
      }
    });
  }
  load() {
    this.loaded = from(this.loadDevice());
  }
  async loadDevice() {
    await this.webAudio.asyncContext();
    this.device = (await this.rnboLoader.loadDeviceUnique(this.id) as RNBO.BaseDevice);
    this.splitter = this.webAudio._ctx.createChannelSplitter(this.device.numOutputChannels);
    this.device.node.connect(this.splitter);
    this.device.node.connect(this.webAudio._ctx.destination);
for(let i=0; i<this.device.numOutputChannels; i++) {
  const p =  new Panner(this.webAudio._ctx, i, this.splitter);
  this.panners[i] = p;
  console.log(`...info for pannerNode ${i}...`);
  console.log(p.pan);
  console.log(`...info for  gainNode ${i}...`);
  console.log(p.vol);
};
  return true;
}
  // Reroute this event handling the the event-hub service once timing is enabled
  updateParameter(valueChangeEvent: number, parameterIndex: number) {
    if (this?.device?.numParameters > parameterIndex) {
      console.log(`setting parameter ${parameterIndex} to ${valueChangeEvent}`);
      this.device.parameters[parameterIndex].value = valueChangeEvent;
    }
  }
  sendMessage(evt: MessageForm) {
    console.log(`sending message at time ${RNBO.TimeNow} ${evt.inport}: ${evt.payload}`);
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
    this.panners[0].rampTo(0.5, 1);
  }
  loadCries() {
    console.log('loading cry buffers');
    let names = this.pkmnService.getIds(); 
    if(names.length === 4) {
      let tracks = names.map((n, i) => {
        return {
          "index": `cry${i}`,
          "url": `cries/${n}.mp3`
        }});

      from(this.rnboLoader.loadPlaylist(this.id, tracks)).subscribe(() => {
        console.log('cries loaded');
      });
    }
  }
  handleOutportMessages(){
      this.device.messageEvent.subscribe((evt: RNBO.MessageEvent) => {
        if(evt.tag === "panMsg") {
          let i: number, x: number, y: number, z: number;
          [i,x,y,z] = evt.payload as [number,number,number,number];
          this.panners[i].position = [x,y,z];
        }
        else {
          console.log(`received message "${evt.tag}" [${evt?.payload}] `);
        }
      })
  }
}


class Panner {
  public ctx: AudioContext
  public pan: PannerNode
  public vol: GainNode
  constructor(_ctx: AudioContext, index: number, split: ChannelSplitterNode) {
    this.ctx = _ctx;
    this.vol = this.ctx.createGain(); 
    this.vol.gain.setValueAtTime(0.5, 0);
    this.pan = this.ctx.createPanner();
    this.pan.panningModel = "HRTF";
    split.connect(this.vol, index).connect(this.pan).connect(this.ctx.destination);
  }
  rampTo(tgt: number, duration: number, exp: boolean = true) {
    let val = this.vol.gain.value;
    let time = this.ctx.currentTime;
    // NECESSARY TO SETUP PROPER EVENT SCHEDULING
    this.vol.gain.setValueAtTime(val, time);
    //console.log(`gain is currently ${val} at time: ${this.ctx.currentTime}`);
    //console.log(`starting ${ exp?'exponential':'linear'} ramp to ${tgt} in ${duration}`);
    if(exp) {
        this.vol.gain.exponentialRampToValueAtTime(tgt, time+duration);
    }
    else {
        this.vol.gain.linearRampToValueAtTime(tgt, time+duration);
    }
    setTimeout(() => console.log(`ramp to ${this.vol.gain.value} completed at time ${this.ctx.currentTime}`), duration*1000);
  }
  set position(pos: [number,number,number]) {
    this.pan.positionX.value = pos[0];
    this.pan.positionY.value = pos[1];
    this.pan.positionZ.value = pos[2];
  }
  set orientation(orient: [number,number,number]) {
    this.pan.orientationX.value = orient[0];
    this.pan.orientationY.value = orient[1];
    this.pan.orientationZ.value = orient[2];
  }
  set coneProps(cone: [number, number, number]) {
    this.pan.coneInnerAngle = cone[0];
    this.pan.coneOuterAngle = cone[1];
    this.pan.coneOuterGain = cone[2];
  }
  set distanceProps(dist: [number, number, number|boolean]) {
    this.pan.rolloffFactor = dist[0];
    this.pan.refDistance = dist[1];
    if(typeof dist[2] === "number") {
      this.pan.distanceModel = "linear";
      this.pan.maxDistance = dist[2];
    }
    else if(dist[2]) {
      this.pan.distanceModel = "exponential";
    }
    else {
      this.pan.distanceModel = "inverse"
    }
  }
}

      /* {
      "panningModel": "HRTF",
      "distanceModel": "inverse",
      "refDistance": 1,
      "maxDistance": 10000,
      "rolloffFactor": 1,
      "coneInnerAngle": 360,
      "coneOuterAngle": 0,
      "coneOuterGain": 0,
      "positionX": 0,
      "positionY": 0,
      "positionZ": 0,
      "orientationX": 0,
      "orientationY": 0,
      "orientationZ": 0
    });
    */
