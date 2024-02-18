import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// src_id, src_outlet, tgt_id, tgt_inlet
///type NodeConnection =  [number, number, number, number]

/*
type SourceNode =
  | OscillatorNode
  | AudioBufferSourceNode
  | MediaElementAudioSourceNode
  | MediaStreamAudioSourceNode;
type SinkNode =
  | AnalyserNode
  | AudioDestinationNode
  | MediaStreamAudioDestinationNode;
type FilterNode =
  | BiquadFilterNode
  | ConvolverNode
  | DelayNode
  | DynamicsCompressorNode
  | WaveShaperNode
  | IIRFilterNode
  | PannerNode;
*/

type connection = Record<string, [number?, number?]>;
interface ConnectionMap {
  sourceMap?: connection; // ID, output, input
  sinkMap?: connection;
}
@Injectable({
  providedIn: 'root',
})
export class AudioService {
  _ctx: AudioContext;
  isLoaded = new BehaviorSubject<boolean>(false);
  defaultSource: AudioBuffer;
  nodes: Map<string, AudioNode> = new Map();

  // not implemented yet... audioGraph: Map<string, ConnectionMap> = new Map();
  constructor() {}
  async decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return this.ctx.decodeAudioData(arrayBuffer);
  }
  get ctx() {
    try {
      if(!this._ctx) {
      this._ctx = new AudioContext();
      }
    if(this._ctx.state !== 'running') {
        console.warn(`audio context not running`);
        this._ctx.resume();
      }
    } catch (e) {
      console.log(`failed to create audio context`);
      console.log(e);
    }
    return this._ctx;
  }
  testSound<T extends AudioNode>(tgt?: T) {
    this.defaultSource ??= this.addDefaultNoiseSource();
    let testNoise = this.ctx.createBufferSource();
    testNoise.buffer = this.defaultSource;
    testNoise.connect(tgt ?? this.ctx.destination);
    console.log(`beginning sound test`);
    testNoise.start();
    testNoise.onended = () => {
      console.log(`sound test complete`);
    };
  }
  playBuffer<T extends AudioNode>(buf: AudioBuffer, tgt?: T) {
    let testSrc = this.ctx.createBufferSource();
    testSrc.buffer = buf;
    testSrc.connect(tgt ?? this.ctx.destination);
    console.log(`beginning buffer playback test`);
    testSrc.start();
    testSrc.onended = () => {
      console.log(`buffer playback test complete`);
    };
  }
  routeOut<T extends AudioNode>(tgtNode: T) {
    if (tgtNode.numberOfOutputs > 0) {
      console.log(`connecting targetNode to destination`);
      tgtNode.connect(this.ctx.destination);
    }
  }
  // add a function/optional arg to handle "true" insertion, i.e. disconnecting a previously connected in and out
  addNode<T extends AudioNode>(
    id: string,
    node: T,
    connections?: ConnectionMap
  ) {
    try {
      this.nodes.set(id, node);
      if (!connections) {
        this.routeOut(node);
        return;
      }
      this.makeConnections(node, true, connections?.sourceMap);
      this.makeConnections(node, false, connections?.sinkMap);
    } catch (e) {
      console.log(`failed to make connections for node: `);
      console.log(node);
      throw e;
    }
  }
  makeConnections<T extends AudioNode>(
    newNode: T,
    isInput: boolean,
    map?: connection
  ) {
    for (let nodeID in map) {
      let existingNode = this.nodes.get(nodeID);
      let connections = map[nodeID];
      if (!existingNode) {
        throw new Error(
          `node with ID ${nodeID} specified in source map does not exist`
        );
      }
      this.validateConnections(
        isInput ? existingNode : newNode,
        isInput ? newNode : existingNode,
        connections
      );
      (isInput ? newNode : existingNode).connect(
        isInput ? existingNode : newNode,
        ...connections
      );
    }
  }
  validateConnections(
    srcNode: AudioNode,
    tgtNode: AudioNode,
    io: [number?, number?]
  ) {
    if (srcNode.numberOfOutputs <= (io?.[0] ?? -1)) {
      throw new Error(`output ${io?.[0]} does not exist`);
    }
    if (tgtNode.numberOfInputs <= (io?.[1] ?? -1)) {
      throw new Error(`input ${io?.[1]} does not exist`);
    }
    return true;
  }
  setupContext(): boolean {
    this._ctx = new AudioContext();
    return this.ctx.state === 'running';
  }
  async asyncContext(): Promise<boolean> {
    this._ctx = new AudioContext();
    this._ctx.resume();
    if (this._ctx.state === 'running') {
    this.isLoaded.next(true);
    }
    
    return this.ctx.state === 'running';
  }
  addDefaultNoiseSource(channels: number = 1, frameCount: number = 1024) {
    const myArrayBuffer = this.ctx.createBuffer(
      channels,
      frameCount,
      this.ctx.sampleRate
    );
    for (let c = 0; c < channels; c++) {
      const nowBuffering = myArrayBuffer.getChannelData(c);
      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = (Math.random() - 0.5);
        // attack-release envelope
        nowBuffering[i] *= Math.sin(Math.PI*(i/frameCount)); 
      }
    }
    return myArrayBuffer;
  }
}
