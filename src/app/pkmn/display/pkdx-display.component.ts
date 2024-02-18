import {  Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, from } from 'rxjs';
import {  PokemonData, PokemonMedia } from 'src/app/services/firebase/firebase-loader.service';
import { PkmnService } from 'src/app/services/pkmn.service';
import { PkmnTeamComponent } from '../ui/pkmn-team/pkmn-team.component';


@Component({
  selector: 'app-pkdx-display',
  template: `
    <div id="pkdxTable">
      <app-pkdx-table (clickedRow)="setView($event)"></app-pkdx-table>
    </div>
    <div id="pkdx-team"> 
    <app-pkmn-team #team [currentSelection]="selectedPokemon|async"></app-pkmn-team>
  </div>
  `,
  styleUrls: ['./pkdx-display.component.scss']
})
export class PkdxDisplayComponent {
      selectedPokemon: Observable<PokemonData&PokemonMedia&{request: 'add'|'delete'|'view'}> = new Observable();
      
      @Output() newCry: EventEmitter<string> = new EventEmitter();
      @ViewChild('team') team: PkmnTeamComponent;
      constructor(private pkmnHelper: PkmnService ) {}
      ngOnInit() {
      }
      setView(evt: ['add'|'delete'|'view', number, string]) {
        console.log(evt);
        this.selectedPokemon = from(this.pkmnHelper.addPokemonMedia(evt[0], evt[1], evt[2]));
        this.selectedPokemon.subscribe((selection) => {
          this.newCry.emit(selection?.name ?? '');
          this.team.addToNextSlot(selection);
        });
      }

}
