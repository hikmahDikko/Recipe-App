import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from '../store/shopping-list/shopping-list.reducers'
import * as ShoppingListActions from '../store/shopping-list/shopping-list.actions';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients : Ingredient[]}>;
  // ingredients: Ingredient[];
  private ingredientSub : Subscription;

  constructor(private slService: ShoppingListService, private store : Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
    // this.ingredients = this.slService.getIngredients();
    // this.ingredientSub = this.slService.ingredientsChanged
    //   .subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );
  }
  
  onEditItem(index) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }

  ngOnDestroy() {
    // this.ingredientSub.unsubscribe();
  }

}
