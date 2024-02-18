import { Injectable } from '@angular/core';
import { FirebaseLoaderService, PokemonData } from './firebase/firebase-loader.service';
import {BehaviorSubject} from 'rxjs';
import { RnboLoaderService } from './rnbo/rnbo-loader.service';
interface Track {
  url: string;
  index: string | number;
}
@Injectable({
  providedIn: 'root'
})
export class PkmnService {
  private buffer_ids: BehaviorSubject<string[]> = new BehaviorSubject(['']);
  //private tgt_device: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private  fbLoader: FirebaseLoaderService, private rnboLoader: RnboLoaderService) { }
  ngOnInit() {
    /* needs to be at most, 1 request every second.
    this.buffer_ids.subscribe(
 (ids: string[]) => {
      this.updateCries();
 }
    )
  
 */
}
  getIds() {
    return this.buffer_ids.getValue();
  }
  setIds(newCries: string[]) {
    this.buffer_ids.next(newCries);
  }
  // this is a device specific method lol
  async updateCries(device_id: string) {
    // this is what the bufferrs are called
    let tracks: Track[] = this.buffer_ids.getValue().map((cry, ind) => {
    return {
      index: `cry${ind+1}`,    // this is what the bufferrs are called  
      url: cry
  }
}).filter((el) => el.url !== '');
    await this.rnboLoader.loadPlaylist(device_id, tracks);
    return true;
}
  async getPokemonData(): Promise<PokemonData[]> {
    let docData = (await this.fbLoader.getDoc(`lists/media`)).data() ?? {};
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
  async addPokemonMedia(request: 'add'|'delete'|'view',index: number, name: string) {
    const sprite = await this.fbLoader.getURL(`sprites/${index}.png`);
    const cry = await this.fbLoader.getURL((`cries/${name}.mp3`));
    return {index, name, sprite, cry, request};
  }
}
