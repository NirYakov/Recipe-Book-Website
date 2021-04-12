import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe', 'This is simply a test', 'https://www.biggerbolderbaking.com/wp-content/uploads/2019/07/15-Minute-Pizza-WS-Thumbnail.png', [new Ingredient("this is very simple", 1), new Ingredient("Willi", 1), new Ingredient("Good vibes +-", 4)]),
  //   new Recipe('Cake ', 'Cake for Bday and special events', 'https://images-gmi-pmc.edge-generalmills.com/1e24b5e7-e3e3-43ce-b737-a2215397f006.jpg', [new Ingredient("Egg", 4), new Ingredient("Totmato souce", 1)]),
  //   new Recipe('Dish of the Bish', 'Best dish Everrrrrrrr', 'https://www.themediterraneandish.com/wp-content/uploads/2017/01/Shakshuka-Recipe-The-Mediterranean-Dish-101.jpg', [new Ingredient('Eggs', 12), new Ingredient("More for the test or something", 4)]),
  //   new Recipe('Hummus ', 'Take it Round or Straight', 'https://www.themediterraneandish.com/wp-content/uploads/2015/01/How-to-make-hummus-recipe-2.jpg', [new Ingredient('Neuclear Hummus', 1), new Ingredient('French Fries', 2)]),
  //   new Recipe('Spagetti ', 'Penne roze is yammy', 'https://www.thechunkychef.com/wp-content/uploads/2019/09/One-Pot-Spaghetti-crop.jpg', [new Ingredient('Penne pasti', 1), new Ingredient('Roze souce', 2)]),
  // ];

  // new Recipe('Spagetti ', 'Penne roze is yammy', 'https://www.thechunkychef.com/wp-content/uploads/2019/09/One-Pot-Spaghetti-crop.jpg', [new Ingredient('Penne pasti', 1), new Ingredient('Roze souce', 2)]),


  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() { return this.recipes.slice() }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes);

  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = (newRecipe);
    this.recipesChanged.next(this.recipes);
    // this.recipesChanged.next(this.recipes); // this.recipes.slice() // but why the slice ? nvm
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());

  }

}
