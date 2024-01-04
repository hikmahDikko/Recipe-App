import { Component } from '@angular/core';
import { DataStorageServive } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private dataStorageService : DataStorageServive){}

  onSaveData(){
    this.dataStorageService.onSaveRecipe();
  }

  onFetchData(){
    this.dataStorageService.onFetchRecipe().subscribe();
  }
}
