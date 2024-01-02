import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm : NgForm
  shoppingEditSub : Subscription;
  editMode : boolean = false;
  itemIndex : number;
  editeditem : Ingredient
  
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.shoppingEditSub = this.slService.startedEditing.subscribe(
      (index : number) => {
        this.editMode = true;
        this.itemIndex = index;
        this.editeditem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name : this.editeditem.name,
          amount : this.editeditem.amount
        })
      }
    );
  }

  onSubmit(form :FormGroup) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(!this.editMode){
      this.slService.addIngredient(newIngredient);
    }else{
      this.slService.updateIngredient(this.itemIndex, newIngredient)
    }
    this.editMode = false;
    form.reset()
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.itemIndex);
    this.editMode = false;
    this.slForm.reset();
  }

  ngOnDestroy(){
    this.shoppingEditSub.unsubscribe();
  }
}
