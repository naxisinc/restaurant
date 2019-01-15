import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  options: any;
  categoryId: string;
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

  ngOnInit() {}
}
