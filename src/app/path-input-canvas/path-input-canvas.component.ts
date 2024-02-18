import { Component, ViewChild, ElementRef, EventEmitter,Input,  Output, SimpleChanges } from '@angular/core';

// templateUrl: 'path-input-canvas.component.html'*/

@Component({
  selector: 'app-path-input-canvas',
  template: `

<canvas #canvas 
   (pointerdown)="handleStart($event)"
   (pointermove)="handleMove($event)"
   style="border:solid black 1px"
   height="360" width="360">
  Your browser does not support canvas element.
</canvas>
<div #options> 
<button (click)="handleEnd()">create</button>
<button (click)="clearCanvas()">clear</button>
<label class="example-value-label">{{range}}</label>
    <mat-slider
        max="10"
        min="0.1"
        step="0.1"
        >
      <input matSliderThumb [(ngModel)]="range">
    </mat-slider>
</div>
`,
styles: [
]
})
export class PathInputCanvasComponent {
    isRecording = false;
    @Input() isReady = false;
    @Input() pathDim = 128;
    range = 2;
    @Output() speed: number = 1;
    currentPosition: [number, number];
    recordedPoints: [number,number][] = [];
    xCoordinates: Float32Array= new Float32Array(128);
    yCoordinates: Float32Array = new Float32Array(128);
    @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;
    private canvasDim: [number,number];
    @Output() pathBuffer: EventEmitter<[Float32Array,Float32Array]> = new EventEmitter();
    constructor() { }
    ngOnChanges(changes: SimpleChanges) {
        if('pathDim' in changes) {
          this.xCoordinates = new Float32Array(this.pathDim);
          this.yCoordinates = new Float32Array(this.pathDim);
        }
    }
    ngAfterViewInit(): void {
      
    const canvas = this.canvasRef.nativeElement;
    this.canvasDim = [canvas.height,canvas.width];
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  this.isReady = true;  
  }
    clearCanvas(): void {
      this.ctx.clearRect(0, 0, this.canvasDim[0], this.canvasDim[1]);
    }
    handleStart(evt: any) {
      console.log('start  ' + evt.pageX + ' ' + evt.pageY);
      this.isRecording = true;
      this.currentPosition = [evt.pageX, evt.pageY];
      this.recordedPoints.push(this.currentPosition);
      }
    handleEnd() {
      console.log('end  ');  
        this.isRecording = false;
        this.isReady = false;
        this.buildBuffer();
    }
    handleMove(evt: PointerEvent) {
      if(this.recordedPoints.length === 0) {
      
        this.isRecording = true;
        this.currentPosition = [evt.pageX, evt.pageY];
        this.recordedPoints.push(this.currentPosition);
      }
      if(this.isRecording && evt.buttons) {
      evt.preventDefault();
      console.log('move  ', evt);
      console.log('move  ' + evt.pageX + ' ' + evt.pageY);  
      this.drawPoint(evt.pageX, evt.pageY);
    
      }
    }
    drawPoint(tgtX: number,tgtY: number) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.currentPosition[0], this.currentPosition[1]);
          this.ctx.lineTo(tgtX,tgtY);

          this.ctx.stroke();
          this.recordedPoints.push(this.currentPosition);
          this.currentPosition = [tgtX,tgtY];
    }
    snormClip(val: number, dim: number): number {
      return Math.min(1, Math.max(0, (val/dim)))*2*this.range-this.range;
    }
    buildBuffer() {
    const step = (this.recordedPoints.length - 1) / (this.pathDim -1);
    for (let i = 0; i < this.pathDim; i++) {
    const index = i * step;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    const lowerValues = this.recordedPoints[lowerIndex];
    const upperValues = this.recordedPoints[upperIndex];

    const xVal = lowerValues[0] + (index - lowerIndex) * (upperValues[0] - lowerValues[0]);
    const yVal = lowerValues[1] + (index - lowerIndex) * (upperValues[1] - lowerValues[1]);
    this.xCoordinates[i] = this.snormClip(xVal, this.canvasDim[0]);
    this.yCoordinates[i] = this.snormClip(yVal, this.canvasDim[1]);
    }
    this.pathBuffer.emit([this.xCoordinates, this.yCoordinates]);
    this.recordedPoints = [];
 }
}
  /*
  function startup() {
  const el = document.getElementById("canvas");
  el.addEventListener("touchstart", handleStart);
  el.addEventListener("touchend", handleEnd);
  el.addEventListener("touchcancel", handleCancel);
  el.addEventListener("touchmove", handleMove);
  log("Initialized.");
}

document.addEventListener("DOMContentLoaded", startup);
  */