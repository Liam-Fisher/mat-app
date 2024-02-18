import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';
import { Storage, ref, listAll, getBlob,getBytes, getDownloadURL } from '@angular/fire/storage';


export interface PokemonData {
  index: number|null
  name: string|null    
}
export interface PokemonMedia {
  sprite: string|null
  cry: string|null
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseLoaderService {
  readonly storage: Required<Storage> = inject(Storage);
  readonly db: Required<Firestore> = inject(Firestore);
  readonly bucket: string = `gs://${this.storage.app.options.storageBucket}`;
  constructor() { }
async listStorageNames(ext: string): Promise<string[]> {
  const  results = await listAll(ref(this.storage, `${this.bucket}/${ext}`));
  return results.items.map((ref) => ref.name.split('.')[0]);
}
async getDoc(path: string) {
  return getDoc(doc(this.db, path));
}
async getPokemonData(): Promise<PokemonData[]> {
      
  let docData = (await this.getDoc(`lists/media`)).data() ?? {};
  console.log('getting pokemon data...');
      if('pokemon' in docData) {
          return docData['pokemon'].map((data: string) => {
            let split = data.split('-');
            const index = (+split[0]);
            const name = split.slice(1).join('-');
            return {index, name};
          });
      }
      return [];
}
async getURL(path: string) {
  let url = await getDownloadURL(this.getRef(path));
  return url;
}
async addPokemonMedia(request: 'add'|'delete'|'view',index: number, name: string) {
      
  const sprite = await getDownloadURL(this.getRef(`sprites/${index}.png`));
  const cry = await getDownloadURL(this.getRef(`cries/${name}.mp3`));
      return {index, name, sprite, cry, request};
}
getRef(path: string) {
  return ref(this.storage, `${this.bucket}/${path}`);
}
async loadBlob(path: string) {
  return getBlob(this.getRef(path));
}
async loadJSON(path: string) {
  return JSON.parse(await (await this.loadBlob(`${path}.json`)).text());
}
async loadAudio(audioCtx: AudioContext, path: string): Promise<AudioBuffer> {
  console.log(`audio from path ${path}`)
  let bytes = await getBytes(this.getRef(`cries/${path}.mp3`));
  return audioCtx.decodeAudioData(bytes);
}

}
