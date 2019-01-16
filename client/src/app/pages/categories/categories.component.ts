import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['description'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  isSelected: boolean = false;
  selected: Object;

  categoryFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private categoryService: CategoriesService) {}

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
      err => {}
    );
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  show(category) {
    this.selected = category;
    this.categoryFormControl.patchValue(category.description);
    this.isSelected = true;
  }

  add() {
    let obj = { description: this.categoryFormControl.value };
    this.categoryService.postCategory(obj).subscribe(
      succ => {
        this.getCategories();
        this.categoryFormControl.reset();
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected['_id'],
      description: this.categoryFormControl.value
    };
    this.categoryService.patchCategory(obj).subscribe(
      succ => {
        this.getCategories();
        this.categoryFormControl.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  delete() {
    this.categoryService.deleteCategory(this.selected['_id']).subscribe(
      succ => {
        this.getCategories();
        this.categoryFormControl.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  cancel() {
    this.categoryFormControl.reset();
    this.isSelected = false;
    this.selected = null;
  }
}