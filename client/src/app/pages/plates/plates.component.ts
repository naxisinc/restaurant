import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material';
import { PlatesService } from '../../services/plates.service';
import { SizesService } from '../../services/sizes.service';
import { MyErrorStateMatcher } from '../../services/validator.service';

@Component({
  selector: 'app-plates',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  imgPath: string = 'http://localhost:3000/images/';
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild('fileInput') fileInput;
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
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      file: ['', [Validators.required]],
      category: ['', [Validators.required]],
      items: this.fb.array([])
    });
  }

  createItem(id, description): FormGroup {
    return this.fb.group({
      _size: id,
      description: description,
      price: '',
      calories: '',
      totalfat: '',
      totalcarbs: ''
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.sizes.forEach(size => {
        this.items = this.parentForm.get('items') as FormArray;
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
  }

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
        console.log('Something is wrong');
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

  clearForm() {
    this.parentForm.controls.description.reset();
    this.parentForm.controls.file.reset();
    this.setIngredients = [];
    this.parentForm.controls.category.reset();
    this.parentForm.get('items')['controls'].forEach(size => {
      size.patchValue({
        price: '',
        calories: '',
        totalfat: '',
        totalcarbs: ''
      });
    });
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
    if (!this.isSelected || this.selected['_id'] !== dish._id) {
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
    this.parentForm.get('items')['controls'].forEach(size => {
      sizeDetailsArray.push(size.value);
    });

    let obj = {
      id: this.selected ? this.selected['_id'] : '',
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      _ingredients: this.ingredientsId,
      _category: this.parentForm.controls.category.value._id,
      sizeDetails: sizeDetailsArray
    };

    return obj;
  }

  add() {
    // let sizeDetailsArray = [];
    // this.parentForm.get('items')['controls'].forEach(size => {
    //   sizeDetailsArray.push(size.value);
    // });

    // let obj = {
    //   description: this.parentForm.controls.description.value,
    //   file: this.fileInput.nativeElement.files[0],
    //   _ingredients: this.ingredientsId,
    //   _category: this.parentForm.controls.category.value._id,
    //   sizeDetails: sizeDetailsArray
    // };
    let data = this.getFormValues();
    console.log(data);
    this.plateService.postPlate(data).subscribe(
      res => {
        this.getPlates();
        this.clearForm();
        this.searchKey = '';
      },
      err => {
        //
      }
    );
  }

  edit() {
    // let sizeDetailsArray = [];
    // this.parentForm.get('items')['controls'].forEach(size => {
    //   sizeDetailsArray.push(size.value);
    // });

    // let obj = {
    //   id: this.selected['_id'],
    //   description: this.parentForm.controls.description.value,
    //   file: this.fileInput.nativeElement.files[0],
    //   _ingredients: this.ingredientsId,
    //   _category: this.parentForm.controls.category.value._id,
    //   sizeDetails: sizeDetailsArray
    // };

    let data = this.getFormValues();
    console.log(data);
    this.plateService.patchPlate(data).subscribe(
      succ => {
        this.getPlates();
        this.clearForm();
        this.isSelected = false;
        this.searchKey = '';
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  delete() {
    this.plateService.deletePlate(this.selected['_id']).subscribe(
      succ => {
        this.getPlates();
        this.clearForm();
        this.isSelected = false;
      },
      error => {
        console.log('Something is wrong');
      }
    );
  }

  cancel() {
    this.clearForm();
    this.isSelected = false;
    this.selected = null;
  }
}
