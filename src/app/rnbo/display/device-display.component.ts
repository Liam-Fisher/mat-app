import { Component, } from '@angular/core';
import {  RnboLoaderService } from '../../services/rnbo/rnbo-loader.service';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { AudioService } from '../../services/webAPI/audio.service';

@Component({
  selector: 'app-device-display',
  templateUrl: './device-display.component.html',
  styleUrls: ['./device-display.component.scss']
})
export class DeviceDisplayComponent {
  isRestarting: BehaviorSubject<boolean> = new BehaviorSubject(false);
  deviceList: Observable<string[]>;
  active_id: string;
  audioLoaded: boolean;
  constructor(public rnboLoader: RnboLoaderService, private webAudio: AudioService) { }
  ngOnInit() {
    this.deviceList = from(this.rnboLoader.loadDeviceList());
  }
  loadDevice(device_id: string) {
    this.active_id = device_id;
    console.log(`selected device ${device_id}`);
  } 
  testAudio() {
    this.webAudio.testSound();
  }
  loadAudio() {
    this.audioLoaded = this.webAudio.setupContext();
  }
}

