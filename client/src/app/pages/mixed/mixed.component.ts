import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatSort,
  MatTable,
  MatTableDataSource,
  MatPaginator
} from "@angular/material";
import { CategoriesService } from "src/app/services/categories.service";
import { SizesService } from "src/app/services/sizes.service";
import { Router } from "@angular/router";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-mixed",
  templateUrl: "./mixed.component.html",
  styleUrls: ["./mixed.component.scss"]
})
export class MixedComponent implements OnInit {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ["description"];
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  route: string;

  constructor(
    private categoryService: CategoriesService,
    private subjectService: SubjectService,
    private sizeService: SizesService,
    private router: Router
  ) {
    this.subjectService.pushTable(this.table);
  }

  ngOnInit() {
    this.route = this.router.url.split("/").pop();
    this.getData();
  }

  async getData() {
    try {
      const result =
        this.route === "sizes"
          ? await this.sizeService.getSizes().toPromise()
          : await this.categoryService.getCategories().toPromise();

      let array = Object.keys(result).map(key => result[key]);
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    } catch (e) {
      console.log(e);
    }
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  show(element) {
    this.subjectService.setElementSelect(element);
    this.subjectService.setItemSelectedFlag(true);
  }
}
