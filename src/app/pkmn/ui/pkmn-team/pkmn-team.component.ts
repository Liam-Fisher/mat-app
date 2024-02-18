import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  PokemonData,
  PokemonMedia,
} from 'src/app/services/firebase/firebase-loader.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { PkmnService } from 'src/app/services/pkmn.service';
type TeamMember = (PokemonData & PokemonMedia) | null;
type TeamMemberRequest = (TeamMember&{request: 'add'|'delete'|'view'})|null;
@Component({
  selector: 'app-pkmn-team',
  templateUrl:'./pkmn-team.component.html',
  styleUrls: ['./pkmn-team.component.scss'],
})
export class PkmnTeamComponent implements OnChanges {
  @Input() currentSelection: TeamMemberRequest;
  team: TeamMember[] = [ null];
  @Output() currentTeam: EventEmitter<(string|null)[]> = new EventEmitter();
  nextSlot: number = 0;
  constructor(private pkmnHelper: PkmnService) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if('currentSelection' in changes) {
      if((this?.currentSelection?.request==='add')&&(!changes.currentSelection.firstChange)) {
        console.log(`selected ${this.currentSelection.name}`);
        let newTeamMember = {
          "index": this.currentSelection.index,
          "name": this.currentSelection.name,
          "sprite": this.currentSelection.sprite,
          "cry": this.currentSelection.cry
        };
        this.addToNextSlot(newTeamMember);
    }
  }
} 
  addToNextSlot(selection: TeamMember) {
    console.log(`adding team member ${selection?.name ?? 'unnamed'} to next available slot`);
      let slotsChecked = 0;
      do {
        if(slotsChecked>0) {
          this.nextSlot++;
        }
        this.nextSlot %= this.team.length;
        if(++slotsChecked === this.team.length) {
          break;
        }
      }
        while(this.team[this.nextSlot] !== null)
        console.log(`next slot was ${this.nextSlot}`);

      this.team[this.nextSlot] = selection; 
      this.emitCryChange();
  }
  emitCryChange() {
    console.log(`emitting cryChange`);
    this.pkmnHelper.setIds(this.team.map((el) => el?.name ?? ''));
  }
  removeFromSlot(index: number) {
    this.team[index] = null;
    this.emitCryChange();
  }
  shuffleTeam(evt: CdkDragDrop<any[], any[], TeamMember>) {
    console.log(evt);
    let m = evt.previousIndex;
    let n = Math.min(evt.currentIndex, this.team.length-1);
    if(evt.container.id === evt.previousContainer.id) {
      let previousData = evt.previousContainer.data[m];
      let data = evt.container.data[n];      
      
      evt.container.data[n] = previousData; 
      evt.previousContainer.data[m] = data;
    }
  }
  /*
  buildTeam(evt: CdkDragDrop<any[], any[], TeamMember>) {
    console.log(evt);
    let m = evt.previousIndex;
    let n = Math.min(evt.currentIndex, 5);
    let data = evt.previousContainer.data[m];
    if(evt.previousContainer.id === "selected-pkmn-viewport") {
      if(evt.container.id === "selected-team-viewport") {
        delete data.request;
        evt.container.data[n] = evt.previousContainer.data[m]; 
        this.emitCryChange();
      }
    }
    else {
      if(evt.container.id === "selected-team-viewport") { //swap
          moveItemInArray(evt.container.data, m, n);
          this.emitCryChange();
      }
      else {
        evt.container.data[n] = evt.previousContainer.data[m]; 
      }
    }
  }*/
}
