import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material";

import { IngredientsService } from "../../services/ingredients.service";
import { SubjectService } from "src/app/services/subject.service";

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

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  // Breakpoints
  breakpointContent: number;

  constructor(
    private ingredientService: IngredientsService,
    private subjectService: SubjectService
  ) {
    this.subjectService.ingredientRefreshed.subscribe(
      succ => {
        if (succ !== null) {
          this.getIngredients();
        }
      },
      err => console.log(err)
    );
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
    this.subjectService.setIngredientSelect(ingredient);
    this.subjectService.setItemSelectedFlag(true);
  }
}
