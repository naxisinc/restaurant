import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomValidator } from "src/app/services/validator.service";
import { SizesService } from "src/app/services/sizes.service";

@Component({
  selector: "app-plates-form",
  templateUrl: "./plates-form.component.html",
  styleUrls: ["./plates-form.component.scss"]
})
export class PlatesFormComponent implements OnInit {
  // Storage sizes
  sizes: any;
  // Save the array of ingredients coming from child component
  ingredientsId = [];

  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;

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
    private customValidator: CustomValidator
  ) {
    // Get sizes
    this.sizesService.getSizes().subscribe(
      res => {
        this.sizes = res;
        this.sizes.forEach(size => {
          this.items = this.parentForm.get("items") as FormArray;
          this.items.push(this.createItem(size._id, size.description));
        });
      },
      err => console.log(err)
    );
  }

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

  ngOnInit() {}

  gettingIngredients(list) {
    this.ingredientsId = list;
  }

  /*clearForm() {
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
  }*/
}
