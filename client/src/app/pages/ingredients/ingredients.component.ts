import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material";
import { Router } from "@angular/router";

import { IngredientsService } from "../../services/ingredients.service";
import { MyErrorStateMatcher } from "../../services/validator.service";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.scss"]
})
export class IngredientsComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  imgPath: string = "http://localhost:3000/images/";
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;

  // Reactive Form and Matcher
  IngredientForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  // Breakpoints
  breakpointContent: number;

  constructor(
    private ingredientService: IngredientsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.IngredientForm = fb.group({
      description: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      file: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    this.getIngredients();

    // Formatting Content
    this.onResize(window);
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
      err => console.log(err)
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

  onResize(event) {
    let windowSize = event.innerWidth;
    if (windowSize >= "1024") {
      this.breakpointContent = 3;
    } else if (windowSize < "1024" && windowSize >= "768") {
      this.breakpointContent = 2;
    } else {
      this.breakpointContent = 1;
    }
  }

  search(searchValue) {
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSearchClear() {
    this.searchKey = "";
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
        this.searchKey = "";
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected["_id"],
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };
    this.ingredientService.patchIngredient(obj).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
        this.isSelected = false;
        this.searchKey = "";
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  delete() {
    this.ingredientService.deleteIngredient(this.selected["_id"]).subscribe(
      succ => {
        this.getIngredients();
        this.IngredientForm.reset();
        this.isSelected = false;
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  cancel() {
    this.IngredientForm.reset();
    this.isSelected = false;
    this.selected = null;
  }
}
