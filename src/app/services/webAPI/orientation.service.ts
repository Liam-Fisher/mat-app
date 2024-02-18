/*
import { Injectable } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  private orientationSubject: Subject<DeviceOrientationEvent>;
  permissionStatus: Observable<boolean>;
  constructor() {}
  onInit() {
    this.orientationSubject = new Subject<DeviceOrientationEvent>();
    this.permissionStatus = from(this.checkPermissions());
  }
  async checkPermissions() {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // Handle iOS 13+ devices.
        let state = await ((DeviceOrientationEvent as any).requestPermission() as Promise<string>);
        if(state !== 'granted') {
          console.log(`Request to access the orientation was rejected with status ${state}`);
          return false;
        }
      }
      window.addEventListener('deviceorientation', (evt: DeviceOrientationEvent) => this.orientationSubject.next(evt));
      return true;
  }
  public getOrientation(): Observable<DeviceOrientationEvent> {
    console.log(`getting orientation`);
    return this.orientationSubject.asObservable();
  }
}

*/