import { Component, OnInit, ViewChild } from '@angular/core';
import { SizesService } from 'src/app/services/sizes.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  selected: boolean = false;
  SizeForm: FormGroup;

  constructor(private sizeService: SizesService, private fb: FormBuilder) {
    this.SizeForm = fb.group({
      size: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ]
    });
  }

  ngOnInit() {
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
    this.SizeForm.patchValue({ size: size.description });
    this.selected = true;
  }

  add() {
    console.log('add');
  }

  edit() {
    console.log('edit');
  }

  delete() {
    console.log('delete');
  }

  resetForm() {
    this.SizeForm.reset();
    this.selected = false;
  }
}
