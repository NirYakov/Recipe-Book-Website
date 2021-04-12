import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map , tap} from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
    firebasePath = 'https://ng-course-recipe-book-10364-default-rtdb.firebaseio.com/';
    ending = 'recipes.json';

    constructor(private http: HttpClient, private recipesService: RecipeService) { }

    // recipes: Recipe[]
    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put(this.firebasePath + this.ending, recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
       return this.http.get<Recipe[]>(this.firebasePath + this.ending)
            .pipe(map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            tap(recipes => 
                {
                    this.recipesService.setRecipes(recipes);
                })
            )
    }

}