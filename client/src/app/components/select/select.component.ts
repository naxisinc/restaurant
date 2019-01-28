import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  options: any;
  @Input() parentForm: FormControl;

  constructor(private categoriesService: CategoriesService) {
    this.categoriesService.getCategories().subscribe(
      res => {
        //
        this.options = res;
      },
      err => {
        //
      }
    );
  }

  compareFn(optionOne, optionTwo): boolean {
    if (optionOne && optionTwo) {
      return optionOne._id === optionTwo._id;
    }
  }

  ngOnInit() {}
}
