import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  imgPath: string = 'http://localhost:3000/ingredients/image/';
  listData: Object;
  isSelected: boolean = false;
  selected: Object;
  @ViewChild('fileInput') fileInput;

  // Reactive Form and Matcher
  IngredientForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private ingredientService: IngredientsService,
    private fb: FormBuilder
  ) {
    this.IngredientForm = fb.group({
      description: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      file: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(
      res => {
        this.listData = res;
        console.log(this.listData['length']);
      },
      err => {}
    );
  }

  show(ingredient) {
    // console.log(ingredient);
    this.selected = ingredient;
    this.IngredientForm.controls.description.patchValue(ingredient.description);
    this.isSelected = true;
  }

  add() {
    let obj = {
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };

    this.ingredientService.postIngredient(obj).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected['_id'],
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };
    // console.log(obj);
    this.ingredientService.patchIngredient(obj).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  delete() {
    this.ingredientService.deleteIngredient(this.selected['_id']).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  cancel() {
    this.IngredientForm.reset();
    this.isSelected = false;
    this.selected = null;
  }
}
