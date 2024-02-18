import { Component, Input,  SimpleChanges } from '@angular/core';
import{ BehaviorSubject, Observable, from} from 'rxjs';
import { FirebaseLoaderService } from '../services/firebase/firebase-loader.service';
import { AudioService } from '../services/webAPI/audio.service';
@Component({
  selector: 'app-pkmn-waapi',
  template: `
  
  <div class="example-label-container">
  <button *ngIf="!(isLoaded|async)"  (click)="loadAudioContext()">load</button>
  <button *ngIf="isLoaded|async" (click)="doTest()">test</button> 
  <button *ngIf="!isPlaying&&(hasPath|async)&&(hasAudio|async)" (click)="playPath()">play</button>
  <span>count?:</span>
      <label class="example-value-label">{{playCount}}</label>
    <mat-slider
        max="12"
        min="1"
        step="1" 
        >
      <input matSliderThumb [(ngModel)]="playCount">
    </mat-slider>
    </div>
  `
  //styleUrls: ['./pkmn-waapi.component.scss']
})
export class PkmnWaapiComponent {
  private ctx: AudioContext; 
  private audio: AudioBuffer 
  @Input() pathBuffer: [Float32Array,Float32Array] = [(new Float32Array(128)), (new Float32Array(128))];
  @Input() cry_url: string
  pan: PannerNode
  vol: GainNode;
  isLoaded = new BehaviorSubject<boolean>(false);
  isPlaying: boolean;
  hasPath: Observable<boolean>;
  hasAudio: Observable<boolean>;
  playCount: number = 10;
constructor(private fbLoader: FirebaseLoaderService, private webAudio: AudioService) {}
stop() {
  this.ctx.close();
  this.isLoaded.next(false);
  this.isPlaying = false;
}
      ngOnInit() {
        this.isPlaying = false; 
      } 
       loadAudioContext() {
         this.webAudio.setupContext();
          this.ctx = this.webAudio._ctx;
          this.vol = this.ctx.createGain(); 
          this.vol.gain.setValueAtTime(0.5, 0);
          this.pan = this.ctx.createPanner();
          this.vol.connect(this.pan).connect(this.ctx.destination);
          this.vol.connect(this.ctx.destination);
          this.isLoaded.next(true);
        }
        doTest() {
          this.webAudio.testSound();
        }
        ngOnChanges(changes: SimpleChanges) {
          if('cry_url' in changes) {
            //console.log(`cry_url changes: ${changes.cry_url}`);
            this.hasAudio = from(this.setCry());
          }
          if('pathBuffer' in changes) {
            //console.log(`pathBuffer changes: ${changes.pathBuffer}`);
            this.hasPath = from(this.setPath());
          }
      }
      async setCry() {
        if(this.cry_url) {
          this.audio = await this.fbLoader.loadAudio(this.ctx, this.cry_url);
          //console.log(`loaded audio with ${this.audio.duration}`);          
          return true;
      }
      return false;
    }
    async setPath() {
      if(this.pathBuffer) {
        return true;
      }
      return false;
    }
      playPath() {
        const playBuf = this.ctx.createBufferSource();
        playBuf.buffer = this.audio;
        playBuf.loop = true;
        this.schedulePathPoints();
        this.isPlaying = true;
        playBuf.addEventListener('ended', ((ev: Event) => this.isPlaying = false));
        playBuf.connect(this.vol);
        playBuf.start();
        playBuf.stop(this.ctx.currentTime+this.audio.duration*this.playCount);
      }
      schedulePathPoints() {
        let duration = this.audio.duration*this.playCount
        let x= this.pathBuffer[0];
        let y= this.pathBuffer[1];
        let len = Math.max(x.length, y.length);
        let t = this.ctx.currentTime;
        this.pan.positionX.setValueAtTime(x[0], t);  
        this.pan.positionX.setValueAtTime(y[0], t);  
        //console.log(`set initial point ${x[0]}, ${y[0]}`);
        let step = duration/len;
          for(let i=1; i<len; i++) {
            t+=step;
            this.pan.positionX.linearRampToValueAtTime(x[i], t);
            this.pan.positionY.linearRampToValueAtTime(y[i], t);
            //console.log(`${i}: ${x[i]}, ${y[i]}`);
          }
      }
      rampTo(tgt: number, duration: number, exp: boolean = false) {
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
}