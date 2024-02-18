import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<app-path-input-canvas *ngIf="appaudio.isLoaded|async" (pathBuffer)="passBuffer($event)"></app-path-input-canvas>
<app-pkmn-waapi #appaudio [pathBuffer]="sharedPath" [cry_url]="addedCry"></app-pkmn-waapi>
<app-pkdx-display *ngIf="appaudio.isLoaded|async" (newCry)="this.passCry($event)"></app-pkdx-display>
`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mat-app';
  addedCry: string
  sharedPath: [Float32Array,Float32Array];
  constructor(private cdr: ChangeDetectorRef) { }
  passBuffer(evt: [Float32Array,Float32Array]) {
    this.sharedPath = evt;
    this.cdr.detectChanges();
  }
  passCry(evt: string) {
    if(evt) {
      this.addedCry = evt;
      this.cdr.detectChanges(); 
    }
  }
}
