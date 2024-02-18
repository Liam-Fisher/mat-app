import { Component,  ElementRef,  EventEmitter,  Input, Output, ViewChild } from '@angular/core';
import {  PokemonData, PokemonMedia } from 'src/app/services/firebase/firebase-loader.service';

@Component({
  selector: 'app-pkmn-view',
  template: `
  <div class="empty-pkmn-view" *ngIf="data===null"> 
  {{info}} 
</div>
<div class="active-pkmn-view" *ngIf="data!==null"> 
<button class="remove" mat-raised-button color="warn" (click)="remover.emit(true)">Remove:  X</button>  
<button class="spriteButton" (click)="playCry()">
<img id="pkmn-selection-sprite" [src]="data?.sprite ?? ''" *ngIf="data!==null">
</button>
<audio #pkmnCry [src]="data?.cry ?? ''" *ngIf="data!==null" (ended)="notPlaying()">
  </audio>
</div>

`,
  styles: [
    `
.spriteButton {
  display: block;
  position: relative;
  z-index: 1;
    color: rgba(1,1,1,0);
    }
.remove {
  display: block;
  min-width: 10px;
  width: 90px;
  height: 30px;
  padding: 0;
  position: relative;
}
    `
  ]
})
export class PkmnViewComponent { 
      @Input() info: string = "no Pokemon has been selected";
      @Input() data: (Partial<PokemonData&PokemonMedia>)|null|undefined;
      @ViewChild('pkmnCry') cry!: ElementRef<HTMLAudioElement>;
      @Output() remover: EventEmitter<boolean> = new EventEmitter();
      isPlaying = false;
      constructor() { }
      notPlaying() {
        this.isPlaying = false;
      }
      playCry() {
        console.log(`clicked a sprite`);
        const audioEl: HTMLAudioElement = this.cry.nativeElement; 
        if(!this.isPlaying) {
          this.isPlaying = true;
          audioEl.play();
      }
  }
      
      
    } 
