import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent  {
  // selectedRecipe: Recipe;
  // private recipeSub : Subscription

  // constructor(private recipeService: RecipeService) { }

  // ngOnInit() {
  //   this.recipeSub = this.recipeService.recipeSelected
  //     .subscribe(
  //       (recipe: Recipe) => {
  //         this.selectedRecipe = recipe;
  //       }
  //     );
  // }

  // ngOnDestroy(): void {
  //   this.recipeSub.unsubscribe();
  // }

}
