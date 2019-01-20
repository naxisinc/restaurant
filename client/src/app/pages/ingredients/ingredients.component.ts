import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material';
import { IngredientsService } from '../../services/ingredients.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  imgPath: string = 'http://localhost:3000/images/';
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild('fileInput') fileInput;

  // Reactive Form and Matcher
  IngredientForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

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
        this.listDataCopy = res;
        this.length = this.listDataCopy.length;
        const event = {
          previousPageIndex: 1,
          pageIndex: 0,
          pageSize: this.pageSize,
          length: this.length
        };
        this.paged(event);
        this.paginator.firstPage();
      },
      err => {
        console.log('Something is wrong');
      }
    );
  }

  paged(event?: PageEvent) {
    // console.log(event);
    const pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const startIndex = pageIndex * this.pageSize;
    const endIndex = pageIndex * this.pageSize + this.pageSize;

    this.listData = this.listDataCopy.slice(startIndex, endIndex);
  }

  search(searchValue) {
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSearchClear() {
    this.searchKey = '';
    this.listData = this.listDataCopy;
  }

  show(ingredient) {
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
        this.searchKey = '';
      },
      error => {
        console.log(`Error: ${error}`);
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected['_id'],
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };
    this.ingredientService.patchIngredient(obj).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
        this.isSelected = false;
        this.searchKey = '';
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
