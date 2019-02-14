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
  // Breakpoins
  breakpointToolbar: number;
  breakpointContent: number;

  // Reactive Form and Matcher
  parentForm: FormGroup;
  items: FormArray;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  // Filter (Sort by)
  filter = new FormControl();
  sortbyGroups: any;
  filtercolspan: number;

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
        this.sortbyGroups = [
          {
            name: "Categories", // Group name
            categories: res
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

    // Getting plates
    this.getPlates();

    // Formatting the toolbar
    this.onResize(window);
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

  onResize(event) {
    let windowSize = event.innerWidth;
    if (windowSize <= 375) {
      this.breakpointToolbar = this.filtercolspan = 1;
    } else if (windowSize > 375 && windowSize <= 1024) {
      this.breakpointToolbar = 2;
      this.filtercolspan = 1;
    } else {
      this.breakpointToolbar = 3;
      this.filtercolspan = 2;
    }
    this.breakpointContent = windowSize <= 375 ? 1 : 3;
  }

  sortby(filterId) {
    this.searchKey = ""; // limpiando la busqueda
    if (filterId.length !== 24) {
      this.listData = this.listDataCopy.sort((val1, val2) => {
        if (filterId === "rating") {
          return val2.averagerate - val1.averagerate; // descending
          // return val1.averagerate - val2.averagerate; // ascending
        } else if (filterId === "l2h" || filterId === "h2l") {
          let dishes = this.listDataCopy;
          for (let i = 0; i < dishes.length; i++) {
            let avgPriceSum: number = 0;
            let details = dishes[i].details;
            for (let j = 0; j < details.length; j++) {
              avgPriceSum += JSON.parse(details[j].price);
            }
            avgPriceSum = JSON.parse(avgPriceSum.toFixed(2));
            dishes[i]["avgPrice"] = JSON.parse(
              (avgPriceSum / details.length).toFixed(2)
            );
          }
          if (filterId === "l2h") {
            return val1.avgPrice - val2.avgPrice; // ascending
          } else {
            return val2.avgPrice - val1.avgPrice; // descending
          }
        }
      });
    } else {
      this.listData = this.listDataCopy.filter(
        x => x._category._id === filterId
      );
    }
  }

  search(searchValue) {
    this.filter.reset(); // limpiando el filter
    // Applying filters and updating data with the result
    this.listData = this.listDataCopy.filter(x =>
      x.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSearchClear() {
    this.searchKey = "";
    this.listData = this.listDataCopy;
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

  seeComments(plateId) {
    localStorage.setItem("plate", plateId);
  }
}
