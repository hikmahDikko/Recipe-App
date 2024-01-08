import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageServive } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub : Subscription;
  isAuthenticated : boolean = false;

  constructor(private dataStorageService : DataStorageServive, private authService : AuthService){}
  
  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      // this.isAuthenticated = !user ? false : true;
      this.isAuthenticated = !!user;
    })
  }

  onSaveData(){
    this.dataStorageService.onSaveRecipe();
  }

  onFetchData(){
    this.userSub = this.dataStorageService.onFetchRecipe().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
      this.userSub.unsubscribe();
  }
}
