import { Component, OnInit, ViewChild } from '@angular/core';
import { SizesService } from 'src/app/services/sizes.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['description'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  isSelected: boolean = false;
  selected: Object;

  sizeFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private sizeService: SizesService) {}

  ngOnInit() {
    this.getSizes();
  }

  getSizes() {
    this.sizeService.getSizes().subscribe(res => {
      let array = Object.keys(res).map(key => res[key]);
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  onSearchClear() {
    this.searchKey = '';
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
      error => {
        console.log('Something is wrong');
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected['_id'],
      description: this.sizeFormControl.value
    };
    this.sizeService.patchSize(obj).subscribe(
      succ => {
        this.getSizes();
        this.sizeFormControl.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  delete() {
    this.sizeService.deleteSize(this.selected['_id']).subscribe(
      succ => {
        this.getSizes();
        this.sizeFormControl.reset();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  cancel() {
    this.sizeFormControl.reset();
    this.isSelected = false;
    this.selected = null;
  }
}
