import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  name: string = 'name';
  idTag: string = 'id';

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit(): void {
    const idTag = this.idTag;
    this.route.params.subscribe((params: Params) => {
      this.id = +params[idTag];
      this.editMode = params[idTag] != null;
      this.initForm();

    });

  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup(
              {
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount,
                  [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)  // '^[1-9]+[0-9]*$'
                  ])
              })
          );
        }
      }


    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    // );

    const newRecipe = this.recipeForm.value;

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }

    this.recipeService.updateRecipe(this.id, this.recipeForm.value);

    this.onChangeRoute();

    // console.log(this.recipeService.getRecipe(this.id));
  }

  get controls()  // a getter
  {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    // const formArrayIng = this.controls;
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup(
        {
          'name': new FormControl(null, Validators.required),
          'amount': new FormControl(null,
            [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/)
            ]
          )
        })
    );

    // this.controls.push(
    //   new FormGroup(
    //     {
    //       'name': new FormControl(null, Validators.required),
    //       'amount': new FormControl(null,
    //         [
    //           Validators.required,
    //           Validators.pattern(/^[1-9]+[0-9]*$/)
    //         ]
    //       )
    //     })
    // );

  }

  onDeleteIngredient(index : number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onChangeRoute() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
