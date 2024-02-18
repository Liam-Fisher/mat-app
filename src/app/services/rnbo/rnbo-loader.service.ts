import { EventEmitter, Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import * as RNBO from '@rnbo/js';
import { AudioService } from '../webAPI/audio.service';
import { FirebaseLoaderService } from 'src/app/services/firebase/firebase-loader.service';
interface Track {
  url: string;
  index: string | number;
}
type connection = [number?, number?];
interface ConnectionMap {
  sourceMap?: Record<string, connection>; // ID, output, input
  sinkMap?: Record<string, connection>;
}
interface DeviceLoadOptions {
  logDevice?: boolean;
  logPatcher?: boolean;
  connections?: ConnectionMap;
}
export enum DeviceLifecycleEvents {
  load,
  start,
  stop,
  destroy
}

export type DeviceLifecycleEvent = `${keyof(typeof DeviceLifecycleEvents)}${'ing'|'ed'}`;
@Injectable({
  providedIn: 'root',
})
export class RnboLoaderService {
  devices: Map<string, RNBO.BaseDevice | null> = new Map();
  deviceList: Observable<string[]>;
  lifecycleEventDuration: number;
  lifecycle: EventEmitter<[string, DeviceLifecycleEvent]> = new EventEmitter();
  constructor(
    private webAudio: AudioService,
    private fbLoader: FirebaseLoaderService
  ) {

}
async loadDeviceList() {
  let deviceList = await this.fbLoader.listStorageNames('devices');
  deviceList.forEach((name: string) => this.devices.set(name, null));
  return deviceList;
}
async lifecycleEmitter(id: string, evt: keyof(typeof DeviceLifecycleEvents)) {
  if(this.devices.has(id)) {
    this.lifecycle.emit([id, `${evt}ing`]);
    await new Promise(resolve => setTimeout(resolve, this.lifecycleEventDuration));
    this.lifecycle.emit([id, `${evt}ed`]);
    return true;
  }      
  else {
    throw new Error(`device ${id} does not exist`);
  }
}

// change url in track to the pokemon name - getBytes doesn;t use the downlaodURL

  async loadPlaylist(tgt_device: string, tracks: Track[]) {


    const device =this.devices.get(tgt_device);

    if (!device) {
      throw new Error(`device ${tgt_device} not loaded exist`);
    }
    
    for await (const track of tracks) {
      console.log(`fetching url ${track.url}`);
      const audioBuf = await this.fbLoader.loadAudio(
        this.webAudio.ctx,
        track.url
      );
      let buf_id =
        typeof track.index === 'number'
          ? device.dataBufferDescriptions?.[track.index]?.id
          : device.dataBufferDescriptions.find(
              (buf) => (buf.id = track.index as string)
            )?.id;
      if (buf_id) {
        console.log(`setting buffer: ${buf_id} to audio in file ${track.url}`);
        await device.setDataBuffer(buf_id, audioBuf);
      }
    }
  }
  async loadPatcher(id: string, logPatcher?: boolean) {
    let patcher = await this.fbLoader.loadJSON(`devices/${id}.export`);
    if (logPatcher) {
      this.patcher_info_logger(id, patcher);
    }
    return patcher;
  }
  async loadDeviceUnique(
    device_id: string
  ): Promise<RNBO.BaseDevice | null> {
    let device: RNBO.BaseDevice;
    try {
      console.log(`const context: AudioContext = this.webAudio.ctx`);
      const context: AudioContext = this.webAudio.ctx;
      console.log("const patcher: RNBO.IPatcher = await this.fbLoader.loadJSON(`devices/${device_id}.export`)");
      const patcher: RNBO.IPatcher = await this.fbLoader.loadJSON(`devices/${device_id}.export`);
      console.log(`patcher.desc.numInputChannels: ${patcher.desc.numInputChannels}`);
      console.log(`patcher.desc.numOutputChannels: ${patcher.desc.numOutputChannels}`);

      console.log(`device = await RNBO.createDevice({ context, patcher })`);
      device = await RNBO.createDevice({ context, patcher });
      console.log(`device.numInputChannels: ${device.numInputChannels}`);
      console.log(`device.numOutputChannels: ${device.numOutputChannels}`);
      const node = device.node; 
      console.log(`node.channelCount: ${node.channelCount}`);
      console.log(`node.channelCountMode: ${node.channelCountMode}`);
      console.log(`node.channelInterpretation: ${node.channelInterpretation}`);
      console.log(`node.numberOfInputs: ${node.numberOfInputs}`);
      console.log(`node.numberOfOutputs: ${node.numberOfOutputs}`);
      this.devices.set(device_id, device);
      this.device_info_logger(device_id, device);
    } catch (err) {
      throw err;
    }
    return device;
  }
  async loadDevice(
    device_id: string,
    options?: DeviceLoadOptions
  ): Promise<RNBO.BaseDevice | null> {
    let device: RNBO.BaseDevice;
    try {
      const context = this.webAudio.ctx;
      const patcher = await this.loadPatcher(device_id, true);
      device = await RNBO.createDevice({ context, patcher });
      this.devices.set(device_id, device);
      this.webAudio.addNode(device_id, device.node, options?.connections);
      if (options?.logDevice) {
        this.device_info_logger(device_id, device);
      }
    } catch (err) {
      throw err;
    }
    return device;
  }
  async loadBuffer(
    deviceID: string | RNBO.BaseDevice,
    bufferID: string | number,
    buffer_src: string | AudioBuffer | ArrayBuffer | Float32Array,
    channelCount?: number
  ): Promise<void> {
    try {
      let buffer: AudioBuffer | Float32Array | ArrayBuffer;
      const device =
        typeof deviceID === 'string' ? this.devices.get(deviceID) : deviceID;
      if (!device) {
        throw new Error(`device ${deviceID} does not exist`);
      }
      if (typeof buffer_src === 'string') {
        buffer = await this.fbLoader.loadAudio(this.webAudio.ctx, buffer_src);
      } else {
        buffer = buffer_src;
      }
      let buf_id =
        typeof bufferID === 'string'
          ? bufferID
          : device.dataBufferDescriptions[bufferID]?.id;
      if (buffer instanceof ArrayBuffer || buffer instanceof Float32Array) {
        let cc = channelCount ?? 1;
        let sr = this.webAudio.ctx?.sampleRate ?? 44100;
        return device.setDataBuffer(buf_id, buffer, cc, sr);
      } else if (buffer instanceof AudioBuffer) {
        return device.setDataBuffer(buf_id, buffer);
      } else {
        throw new Error('array buffer input is missing channel count argument');
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  patcher_info_logger(device_id: string, patcher_obj: RNBO.IPatcher) {
    console.log(`logging patcher object for rnbo device with id ${device_id}`);
    console.log(patcher_obj);
  }
  device_info_logger(device_id: string, device: RNBO.BaseDevice) {
    console.log(`logging info for rnbo device: ${device_id} of type ${device.type} and source type ${device.sourceType}`);


    console.log('parameters: ');
    device.parametersById.forEach((param, id) => {
      console.log(`id: ${id}`);
      console.log(param);
    });

    console.log('messages: ');
    device.messages.forEach((msg) => {
      console.log(`tag: ${msg.tag}`);
      if ('meta' in msg) {
        console.log(msg.meta);
      }
    });

    console.log('buffers: ');
    device.dataBufferDescriptions.forEach((buf) => {
      console.log(`id: ${buf.id}`);
      console.log(`type: ${buf.type}`);
    });
    console.log('audioNode: ');
    console.log(device.node);
  }
  // Could add loadPreset, loadScore, etc... anything stored as a file
}
