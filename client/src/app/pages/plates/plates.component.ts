import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material";
import { PlatesService } from "../../services/plates.service";
import { SizesService } from "../../services/sizes.service";
import { CategoriesService } from "../../services/categories.service";
import { MyErrorStateMatcher } from "../../services/validator.service";

//============
export interface Pokemon {
  value: string;
  viewValue: string;
}
export interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: "app-plates",
  templateUrl: "./plates.component.html",
  styleUrls: ["./plates.component.scss"]
})
export class PlatesComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  imgPath: string = "http://localhost:3000/images/";
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;
  // Save the array of ingredients coming from child component
  ingredientsId = [];
  sizes: any;
  // Set the Ingredients in the child component
  setIngredients = [];

  // Reactive Form and Matcher
  parentForm: FormGroup;
  items: FormArray;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  //==============
  pokemonControl = new FormControl();
  pokemonGroups: any;

  constructor(
    private plateService: PlatesService,
    private sizesService: SizesService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {
    // Get sizes
    this.sizesService.getSizes().subscribe(
      res => {
        this.sizes = res;
      },
      err => {
        //
      }
    );

    // Get categories
    this.categoriesService.getCategories().subscribe(
      res => {
        this.pokemonGroups = [
          {
            name: "Categories",
            pokemon: res
          }
        ];
      },
      err => {
        //
      }
    );

    this.parentForm = this.fb.group({
      description: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      file: ["", [Validators.required]],
      category: ["", [Validators.required]],
      items: this.fb.array([])
    });
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

  ngOnInit() {
    setTimeout(() => {
      // This's necessary cause sizes is a Observable result
      this.sizes.forEach(size => {
        this.items = this.parentForm.get("items") as FormArray;
        this.items.push(this.createItem(size._id, size.description));
      });
    }, 500);
    // call the plates
    this.getPlates();
    // setTimeout(() => {
    //   this.parentForm.get('items')['controls'].forEach(element => {
    //     console.log(element.controls);
    //   });
    // }, 1000);
  }

  gettingIngredients(list) {
    this.ingredientsId = list;
  }

  getPlates() {
    this.plateService.getPlates().subscribe(
      res => {
        this.listDataCopy = res;
        this.length = this.listDataCopy.length;
        const event = {
          previousPageIndex: 1,
          pageIndex: 0,
          pageSize: this.pageSize,
          length: this.length
        };
        this.paged(event);
        this.paginator.firstPage();
      },
      err => {
        console.log("Something is wrong");
      }
    );
  }

  paged(event?: PageEvent) {
    const pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const startIndex = pageIndex * this.pageSize;
    const endIndex = pageIndex * this.pageSize + this.pageSize;

    this.listData = this.listDataCopy.slice(startIndex, endIndex);
  }

  search(searchValue) {
    console.log(this.listDataCopy);
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  clearForm() {
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
  }

  show(dish) {
    // Patch values in the form
    this.parentForm.patchValue({
      description: dish.description,
      category: dish._category,
      items: dish.details
    });
    // Ingredients
    if (!this.isSelected || this.selected["_id"] !== dish._id) {
      this.setIngredients = [];
      dish._ingredients.forEach(ingredient => {
        this.setIngredients.push(ingredient.description);
        this.ingredientsId.push(ingredient._id); // update the listener array
      });
    }
    // Updating variables
    this.selected = dish;
    this.isSelected = true;
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
      res => {
        this.getPlates();
        this.clearForm();
        this.searchKey = "";
      },
      err => {
        //
      }
    );
  }

  edit() {
    let data = this.getFormValues();
    this.plateService.patchPlate(data).subscribe(
      succ => {
        this.getPlates();
        this.clearForm();
        this.isSelected = false;
        this.searchKey = "";
      },
      error => {
        console.log("Something is wrong");
      }
    );
  }

  delete() {
    this.plateService.deletePlate(this.selected["_id"]).subscribe(
      succ => {
        this.getPlates();
        this.clearForm();
        this.isSelected = false;
      },
      error => {
        console.log("Something is wrong");
      }
    );
  }

  cancel() {
    this.clearForm();
    this.isSelected = false;
    this.selected = null;
  }
}
