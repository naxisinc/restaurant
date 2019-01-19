import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material';
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

  imgPath: string = 'http://localhost:3000/plates/image/';
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild('fileInput') fileInput;
  ingredientsId: string[];
  sizes: any;

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
  }

  gettingIngredients(list) {
    this.ingredientsId = list;
  }

  add() {
    let sizeDetailsArray = [];
    this.parentForm.get('items')['controls'].forEach(size => {
      sizeDetailsArray.push(size.value);
    });

    let obj = {
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      _ingredients: this.ingredientsId,
      category: this.parentForm.controls.category.value._id,
      sizeDetails: sizeDetailsArray
    };

    console.log(obj);
    this.plateService.postPlate(obj).subscribe(
      res => {
        //
      },
      err => {
        //
      }
    );
  }
}
