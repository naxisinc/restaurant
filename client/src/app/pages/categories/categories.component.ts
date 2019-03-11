import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { CategoriesService } from "src/app/services/categories.service";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ["description"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(
    private categoryService: CategoriesService,
    private subjectService: SubjectService
  ) {
    this.subjectService.categoryRefreshed.subscribe(
      succ => {
        if (succ !== null) {
          this.getCategories();
        }
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      res => {
        let array = Object.keys(res).map(key => res[key]);
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      },
      err => console.log(err)
    );
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  show(category) {
    this.subjectService.setCategorySelect(category);
    this.subjectService.setItemSelectedFlag(true);
  }
}
