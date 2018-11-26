import { Component, OnInit } from '@angular/core';
import { SizesService } from 'src/app/services/sizes.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {
  constructor(private sizeService: SizesService) {}

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['description'];

  ngOnInit() {
    this.sizeService.getSizes().subscribe(res => {
      let array = Object.keys(res).map(key => res[key]);
      this.listData = new MatTableDataSource(array);
    });
  }
}
