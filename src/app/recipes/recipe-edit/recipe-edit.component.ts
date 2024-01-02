import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm :FormGroup

  constructor(private route: ActivatedRoute, private recipeservice : RecipeService, private router : Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeIngredient = new FormArray([]);

    if(this.editMode) {
      const recipe= this.recipeservice.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImage = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredients']) {
        for(let ingredient of recipe.ingredients){
          recipeIngredient.push(
            new FormGroup({
              'name' : new FormControl(ingredient.name, Validators.required),
              'amount' : new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath' : new FormControl(recipeImage, Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredient
    })
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name' : new FormControl(null, Validators.required),
        'amount' : new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    )
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['descriptions'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    //   )
    if (this.editMode){
      this.recipeservice.updateRecipe(this.id, this.recipeForm.value);
      }else{
      this.recipeservice.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['../'], {relativeTo : this.route})
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo : this.route})
    // this.recipeForm.reset();
  }

  onRemove (index : number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
