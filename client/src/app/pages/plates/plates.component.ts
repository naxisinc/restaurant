import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material";

import { PlatesService } from "../../services/plates.service";
import { CategoriesService } from "../../services/categories.service";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-plates",
  templateUrl: "./plates.component.html",
  styleUrls: ["./plates.component.scss"]
})
export class PlatesComponent implements OnInit, OnDestroy {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  // Breakpoints
  breakpointToolbar: number;
  breakpointContent: number;
  // MatPaginator Inputs
  length = 0;
  pageSize = 3;
  pageSizeOptions: number[] = [3, 6, 12, 24];
  // Filter (Sort by)
  filter = new FormControl();
  sortbyGroups: any;
  filtercolspan: number;
  private subscriptions$ = [];

  constructor(
    private plateService: PlatesService,
    private subjectService: SubjectService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    // Get categories
    this.subscriptions$.push(
      this.categoriesService.getCategories().subscribe(
        res => {
          this.sortbyGroups = [
            {
              name: "Categories", // Group name
              categories: res
            }
          ];
        },
        err => console.log(err)
      )
    );

    // Listen from the refresh observable
    this.subscriptions$.push(
      this.subjectService.dishRefreshed.subscribe(
        succ => {
          if (succ !== null) {
            this.getPlates();
          }
        },
        err => console.log(err)
      )
    );

    // Getting plates
    this.getPlates();

    // Formatting the toolbar
    this.onResize(window);
  }

  getPlates() {
    this.subscriptions$.push(
      this.plateService.getPlates().subscribe(
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
      )
    );
  }

  paged(event?: PageEvent) {
    const pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const startIndex = pageIndex * this.pageSize;
    const endIndex = pageIndex * this.pageSize + this.pageSize;

    this.listData = this.listDataCopy.slice(startIndex, endIndex);
  }

  colspan: number = 1;
  onResize(event) {
    let windowSize = event.innerWidth;
    this.breakpointContent = windowSize <= 375 ? 1 : 3;
    if (windowSize <= 375) {
      this.breakpointToolbar = 2;
      this.colspan = 2;
    } else {
      this.breakpointToolbar = 3;
      this.colspan = 1;
    }
  }

  sortby(filterId) {
    this.searchKey = ""; // limpiando la busqueda
    if (filterId.length !== 24) {
      this.listData = this.listDataCopy.sort((val1, val2) => {
        if (filterId === "rating") {
          return val2.averagerate - val1.averagerate; // descending
          // return val1.averagerate - val2.averagerate; // ascending
        } else if (filterId === "l2h" || filterId === "h2l") {
          let dishes = this.listDataCopy;
          for (let i = 0; i < dishes.length; i++) {
            let avgPriceSum: number = 0;
            let details = dishes[i].details;
            for (let j = 0; j < details.length; j++) {
              avgPriceSum += JSON.parse(details[j].price);
            }
            avgPriceSum = JSON.parse(avgPriceSum.toFixed(2));
            dishes[i]["avgPrice"] = JSON.parse(
              (avgPriceSum / details.length).toFixed(2)
            );
          }
          if (filterId === "l2h") {
            return val1.avgPrice - val2.avgPrice; // ascending
          } else {
            return val2.avgPrice - val1.avgPrice; // descending
          }
        }
      });
    } else {
      this.listData = this.listDataCopy.filter(
        x => x._category._id === filterId
      );
    }
  }

  search(searchValue) {
    this.filter.reset(); // limpiando el filter
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSearchClear() {
    this.searchKey = "";
    this.listData = this.listDataCopy;
  }

  show(dish) {
    this.subjectService.setDishSelect(dish);
    this.subjectService.setItemSelectedFlag(true);
  }

  seeComments(plateId, index) {
    localStorage.setItem("plate", plateId);
    localStorage.setItem("index", index);
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
