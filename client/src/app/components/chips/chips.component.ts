import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from "@angular/material";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { IngredientsService } from "../../services/ingredients.service";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "app-chips",
  templateUrl: "chips.component.html",
  styleUrls: ["chips.component.scss"]
})
export class ChipsComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  @Input() fruits = [];
  allFruits: string[];
  // Exporting the list of ingredients
  @Output() ingredients = new EventEmitter();
  Ingredients: any;
  private subscriptions$ = [];

  @ViewChild("fruitInput")
  fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  constructor(private ingredientsService: IngredientsService) {}

  ngOnInit() {
    this.subscriptions$.push(
      this.ingredientsService.getIngredients().subscribe(
        res => {
          this.Ingredients = res;
          this.allFruits = this.Ingredients.map(x => x.description);
        },
        err => {
          console.log(err);
        }
      )
    );

    setTimeout(() => {
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) =>
          fruit ? this._filter(fruit) : this.allFruits.slice()
        )
      );
    }, 1000); // esto tengo q removerlo
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || "").trim()) {
        if (this.allFruits.includes(value)) {
          this.fruits.push(value.trim());
        }
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    this.emit();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
    this.emit();
  }

  emit() {
    // Emit the event for parent component
    let arrAux = [];
    this.fruits.forEach(element => {
      arrAux.push(this.Ingredients.find(x => x.description === element)._id);
    });
    this.ingredients.emit(arrAux);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      fruit => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
