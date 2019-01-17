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
      sizeDetails: this.fb.array([])
    });
  }

  get detailsOfSize() {
    return this.parentForm.get('sizeDetails') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      price: '',
      calories: '',
      totalfat: '',
      totalcarbs: ''
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.sizes.forEach(size => {
        this.detailsOfSize.push(this.createItem());
      });
    }, 1000);
    // for (let i = 0; i < this.sizes.length; i++) {
    //   this.detailsOfSize.push(this.createItem());
    // }
  }

  showForm() {
    console.log(this.parentForm.controls);
  }

  gettingIngredients(list) {
    this.ingredientsId = list;
  }

  add() {
    let obj = {
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      _ingredients: this.ingredientsId,
      category: this.parentForm.controls.category.value._id
    };
    // console.log(obj);
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
