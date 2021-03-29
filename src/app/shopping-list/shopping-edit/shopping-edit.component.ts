import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;

  subscription: Subscription;

  editmode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editmode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue(
          {
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
      }
    );
  }


  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editmode) {
      this.slService.updateIngridient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }

    this.editmode = false;
    this.clearForm(form);
  }

  clearForm(form: NgForm) {
    this.editmode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editmode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  // clearForm()
  // {
  //   this.editmode = false;
  //   this.slForm.reset();
  // }

}

