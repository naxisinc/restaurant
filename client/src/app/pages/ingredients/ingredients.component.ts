import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { IngredientsService } from '../../services/ingredients.service';
import { PagerService } from '../../services/pager.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  imgPath: string = 'http://localhost:3000/ingredients/image/';
  listData: any;
  listDataCopy: any;
  isSelected: boolean = false;
  selected: Object;
  @ViewChild('fileInput') fileInput;

  // Reactive Form and Matcher
  IngredientForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  // Pagination Variables
  pager: any = {}; // pager object
  pagedItems: any[]; // paged items

  // MatPaginator Inputs
  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private ingredientService: IngredientsService,
    private fb: FormBuilder,
    private pagerService: PagerService
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
        this.listData = this.listDataCopy = res;
        this.length = this.listDataCopy.length;
      },
      err => {
        console.log('Something is wrong');
      }
    );
  }

  paged(event?: PageEvent) {
    console.log(`Length: ${event.length}`);
    console.log(`PageSize: ${event.pageSize}`);
    console.log(`PageIndex: ${event.pageIndex}`);
    // get pager object from service
    this.pager = this.pagerService.getPager(
      event.length,
      event.pageIndex,
      event.pageSize
    );

    // get current page of items
    this.pagedItems = this.listData.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  // setPage(page: number) {
  //   // get pager object from service
  //   this.pager = this.pagerService.getPager(
  //     this.listData.length,
  //     page,
  //     this.paginator.pageSize
  //   );

  //   // get current page of items
  //   this.pagedItems = this.listData.slice(
  //     this.pager.startIndex,
  //     this.pager.endIndex + 1
  //   );
  // }

  search(searchValue) {
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
    // initialize to page 1
    // this.setPage(1);
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
