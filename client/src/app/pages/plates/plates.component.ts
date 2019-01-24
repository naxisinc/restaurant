import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material";
import { PlatesService } from "../../services/plates.service";
import { SizesService } from "../../services/sizes.service";
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
  ingredientsId: string[];
  sizes: any;
  setIngredients = [];
  setCategory: Object;
  // breakpoint: any;

  // Reactive Form and Matcher
  parentForm: FormGroup;
  items: FormArray;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  constructor(
    private plateService: PlatesService,
    private sizesService: SizesService,
    private fb: FormBuilder
  ) {
    this.sizesService.getSizes().subscribe(
      res => {
        this.sizes = res;
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
      price: "",
      calories: "",
      totalfat: "",
      totalcarbs: ""
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.sizes.forEach(size => {
        this.items = this.parentForm.get("items") as FormArray;
        this.items.push(this.createItem(size._id, size.description));
      });
    }, 1000);

    // call the plates
    this.getPlates();
    // setTimeout(() => {
    //   this.listData.forEach(element => {
    //     console.log(element);
    //   });
    // }, 1000);

    // this.breakpoint = window.innerWidth <= 1400 ? 1 : 6;
  }

  // Taken from https://stackoverflow.com/questions/48493652/angular-5-mat-grid-list-responsive?rq=1
  // onResize(event) {
  //   this.breakpoint = event.target.innerWidth <= 1400 ? 1 : 6;
  // }

  gettingIngredients(list) {
    // console.log(list);
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

  show(dish) {
    this.parentForm.controls.description.patchValue(dish.description);
    // console.log(dish);
    if (!this.isSelected || this.selected["_id"] !== dish._id) {
      this.setIngredients = [];
      dish._ingredients.forEach(ingredient => {
        this.setIngredients.push(ingredient.description);
      });
    }
    this.setCategory = dish._category;
    this.selected = dish;
    this.isSelected = true;
  }

  add() {
    let sizeDetailsArray = [];
    this.parentForm.get("items")["controls"].forEach(size => {
      delete size.value.description;
      sizeDetailsArray.push(size.value);
    });

    let obj = {
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      _ingredients: this.ingredientsId,
      category: this.parentForm.controls.category.value._id,
      sizeDetails: sizeDetailsArray
    };

    this.plateService.postPlate(obj).subscribe(
      res => {
        this.getPlates();
        this.parentForm.reset();
        this.searchKey = "";
      },
      err => {
        //
      }
    );
  }
}
