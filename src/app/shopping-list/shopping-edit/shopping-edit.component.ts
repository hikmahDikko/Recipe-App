import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../../store/shopping-list/shopping-list.actions';
import * as fromShoppingList from '../../store/shopping-list/shopping-list.reducers'


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm : NgForm
  shoppingEditSub : Subscription;
  editMode : boolean = false;
  editeditem : Ingredient
  
  constructor(
    private slService: ShoppingListService, 
    private store : Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    // this.shoppingEditSub = this.slService.startedEditing.subscribe(
    //   (index : number) => {
    //     this.editMode = true;
    //     this.itemIndex = index;
    //     this.editeditem = this.slService.getIngredient(index);
    //     this.slForm.setValue({
    //       name : this.editeditem.name,
    //       amount : this.editeditem.amount
    //     })
    //   }
    // );

    this.shoppingEditSub = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editeditem = stateData.editedIngredient;
        this.slForm.setValue({
          name : this.editeditem.name,
          amount : this.editeditem.amount
        })
      }else{
        this.editMode = false;
      }
    })
  }

  onSubmit(form :NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(!this.editMode){
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }else{
      // this.slService.updateIngredient(this.itemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    }
    this.editMode = false;
    form.reset()
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    // this.slService.deleteIngredient(this.itemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.editMode = false;
    this.slForm.reset();
  }

  ngOnDestroy(){
    this.shoppingEditSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
}
