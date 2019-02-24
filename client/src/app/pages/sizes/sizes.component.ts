import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SizesService } from "../../services/sizes.service";
import { MyErrorStateMatcher } from "../../services/validator.service";

@Component({
  selector: "app-sizes",
  templateUrl: "./sizes.component.html",
  styleUrls: ["./sizes.component.scss"]
})
export class SizesComponent implements OnInit {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ["description"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  isSelected: boolean = false;
  selected: Object;

  sizeFormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private sizeService: SizesService, private router: Router) {}

  ngOnInit() {
    this.getSizes();
  }

  getSizes() {
    this.sizeService.getSizes().subscribe(
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

  show(size) {
    this.selected = size;
    this.sizeFormControl.patchValue(size.description);
    this.isSelected = true;
  }

  add() {
    let obj = { description: this.sizeFormControl.value };
    this.sizeService.postSize(obj).subscribe(
      succ => {
        this.getSizes();
        this.sizeFormControl.reset();
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
      description: this.sizeFormControl.value
    };
    this.sizeService.patchSize(obj).subscribe(
      succ => {
        this.getSizes();
        this.sizeFormControl.reset();
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

  delete() {
    this.sizeService.deleteSize(this.selected["_id"]).subscribe(
      succ => {
        this.getSizes();
        this.sizeFormControl.reset();
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
    this.sizeFormControl.reset();
    this.isSelected = false;
    this.selected = null;
  }
}
