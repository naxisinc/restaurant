import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomValidator } from "src/app/services/validator.service";
import { SizesService } from "src/app/services/sizes.service";
import { PlatesService } from "src/app/services/plates.service";
import { SubjectService } from "src/app/services/subject.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-plates-form",
  templateUrl: "./plates-form.component.html",
  styleUrls: ["./plates-form.component.scss"]
})
export class PlatesFormComponent implements OnInit, OnDestroy {
  // Storage sizes
  sizes: any;
  // Save the array of ingredients coming from child component
  ingredientsId = [];
  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;
  // Set the Ingredients in the child component
  setIngredients = [];
  private subscriptions$ = [];

  // Reactive Form and properties
  parentForm: FormGroup = this.fb.group({
    description: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    ],
    file: ["", [Validators.required, this.customValidator.validatingExt]],
    category: ["", [Validators.required]],
    items: this.fb.array([])
  });
  // Form dynamic property
  items: FormArray;

  constructor(
    private fb: FormBuilder,
    private sizesService: SizesService,
    private customValidator: CustomValidator,
    private plateService: PlatesService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  createItem(id, description): FormGroup {
    return this.fb.group({
      _size: id,
      description: description,
      price: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.[0-9]{2}$")]
      ],
      calories: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      totalfat: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      totalcarbs: ["", [Validators.required, Validators.pattern("^[0-9]+$")]]
    });
  }

  ngOnInit() {
    // // Get sizes
    this.subscriptions$.push(
      this.sizesService.getSizes().subscribe(
        res => {
          this.sizes = res;
          this.sizes.forEach(size => {
            this.items = this.parentForm.get("items") as FormArray;
            this.items.push(this.createItem(size._id, size.description));
          });
        },
        err => console.log(err)
      )
    );

    // DishSelected Observable
    this.subscriptions$.push(
      this.subjectService.dishSelected.subscribe(
        res => {
          if (res !== null) {
            this.selected = res;
            // console.log(this.selected);
            this.parentForm.patchValue({
              description: this.selected["description"],
              category: this.selected["_category"],
              items: this.selected["details"]
            });
            // Ingredients
            //if (!this.isSelected || this.selected["_id"] !== dish._id) {
            this.setIngredients = [];
            this.selected["_ingredients"].forEach(ingredient => {
              this.setIngredients.push(ingredient.description);
              this.ingredientsId.push(ingredient._id); // update the listener array
            });
            //}
            this.isSelected = true;
          }
        },
        err => console.log(err)
      )
    );
  }

  gettingIngredients(list) {
    this.ingredientsId = list;
  }

  getFormValues() {
    let sizeDetailsArray = [];
    this.parentForm.get("items")["controls"].forEach(size => {
      sizeDetailsArray.push(size.value);
    });
    let obj = {
      id: this.isSelected ? this.selected["_id"] : "undefined",
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      _ingredients: this.ingredientsId,
      _category: this.parentForm.controls.category.value._id,
      sizeDetails: sizeDetailsArray
    };
    return obj;
  }

  add() {
    let data = this.getFormValues();
    this.plateService.postPlate(data).subscribe(
      res => this.clearEverything(),
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  edit() {
    let data = this.getFormValues();
    this.plateService.patchPlate(data).subscribe(
      res => {
        this.clearEverything();
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  delete() {
    this.plateService.deletePlate(this.selected["_id"]).subscribe(
      res => {
        this.clearEverything();
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  cancel() {
    this.selected = null;
    this.clearEverything();
    this.isSelected = false;
  }

  clearEverything() {
    this.isSelected = false;

    this.parentForm.reset();
    this.sizes.forEach((size, index) => {
      this.parentForm.controls.items["controls"][
        index
      ].controls.description.patchValue(size.description);
      this.parentForm.controls.items["controls"][
        index
      ].controls._size.patchValue(size._id);
    });
    this.setIngredients = [];
    this.ingredientsId = []; // claening ingredients previously selected

    this.subjectService.setItemSelectedFlag(false);
    this.subjectService.dishDataSourceRefresh();
  }

  ngOnDestroy() {
    this.subjectService.setDishSelect(null);
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
