import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { CategoriesService } from "../../services/categories.service";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"]
})
export class SelectComponent implements OnInit, OnDestroy {
  options: any;
  @Input() parentForm: FormControl;
  @Output() category = new EventEmitter<any>();
  private subscriptions$ = [];

  constructor(private categoriesService: CategoriesService) {}

  compareFn(optionOne, optionTwo): boolean {
    if (optionOne && optionTwo) {
      return optionOne._id === optionTwo._id;
    }
  }

  ngOnInit() {
    this.subscriptions$.push(
      this.categoriesService.getCategories().subscribe(
        res => {
          this.options = res;
        },
        err => {
          throw Error(err);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
