import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { SizesService } from "../../services/sizes.service";
import { SubjectService } from "src/app/services/subject.service";

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

  constructor(
    private sizeService: SizesService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.getSizes();
    this.subjectService.sizeRefreshed.subscribe(
      succ => {
        if (succ !== null) {
          this.getSizes();
        }
      },
      err => console.log(err)
    );
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
    this.subjectService.setSizeSelect(size);
    this.subjectService.setItemSelectedFlag(true);
  }
}
