import { Component,EventEmitter, ViewChild, Output, ChangeDetectorRef } from '@angular/core';
import { FirebaseLoaderService, PokemonData } from 'src/app/services/firebase/firebase-loader.service';

import {Observable, from} from 'rxjs'
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'



@Component({
  selector: 'app-pkdx-table',
  templateUrl: 'pkdx-table.component.html',
  styleUrls: ['pkdx-table.component.scss']
})
export class PkdxTableComponent  {
  pokemonList: Observable<string[]>;
  displayedColumns: string[] = ['index', 'name'];
  dataSource: MatTableDataSource<PokemonData>;
  lastRowClicked: PokemonData;
  @Output() clickedRow: EventEmitter<[ 'add'|'delete'|'view', number, string]> = new EventEmitter(); 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private cdRef: ChangeDetectorRef, private fbLoader: FirebaseLoaderService) { }

  ngAfterViewInit() {
    from(this.fbLoader.getPokemonData())
    .subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
      this.cdRef.detectChanges()
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
