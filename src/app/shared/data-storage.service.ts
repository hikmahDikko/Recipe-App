import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn : 'root',
})
export class DataStorageServive{
    constructor(private http : HttpClient, private recipeService : RecipeService, private authService : AuthService){}

    onSaveRecipe() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://reicipe-app-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe();
    }

    onFetchRecipe() {
       return this.http.get<Recipe[]>('https://reicipe-app-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe, 
                    ingredients : recipe.ingredients ? recipe.ingredients : []
                }
            })
        }),
        tap((recipes) =>{
            this.recipeService.setRecipes(recipes);
        }))
    }
}
