import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { CategoriesService } from "src/app/services/categories.service";
import { SizesService } from "src/app/services/sizes.service";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-mixed",
  templateUrl: "./mixed.component.html",
  styleUrls: ["./mixed.component.scss"]
})
export class MixedComponent implements OnInit, OnDestroy {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ["description"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  route: string;
  private subscriptions$ = [];

  constructor(
    private sizeService: SizesService,
    private subjectService: SubjectService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit() {
    // Getting the route from observer
    this.subscriptions$.push(
      this.subjectService.currentRoute.subscribe(route => {
        this.route = route;
      })
    );

    // Listen the observer for refresh the datasource
    this.subscriptions$.push(
      this.subjectService.elementRefreshed.subscribe(
        succ => {
          if (succ !== null) {
            this.getData();
          }
        },
        err => console.log(err)
      )
    );

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

  ngOnDestroy() {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
