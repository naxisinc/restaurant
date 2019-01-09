import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  options: any;
  categoryId: string;
  @Output() valueChange = new EventEmitter();
  counter = 0;

  // Reactive Form and Matcher
  autoFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

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

  valueChanged() {
    this.counter++;
    this.valueChange.emit(this.counter);
  }

  isMatcher() {
    if (this.autoFormControl.valid) {
      console.log('Valid Form');
    } else {
      console.log('Invalid Form');
    }
  }

  ngOnInit() {}

  displayFn(obj) {
    this.categoryId = obj ? obj._id : null;
    return obj ? obj.description : undefined;
  }
}
