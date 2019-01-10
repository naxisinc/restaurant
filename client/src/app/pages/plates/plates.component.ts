import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material";
import { PlatesService } from "../../services/plates.service";
import { MyErrorStateMatcher } from "../../services/validator.service";

@Component({
  selector: "app-plates",
  templateUrl: "./plates.component.html",
  styleUrls: ["./plates.component.scss"]
})
export class PlatesComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  imgPath: string = "http://localhost:3000/plates/image/";
  listData: any; // show the requested array
  listDataCopy: any; // keep the original array
  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;
  listOfIngredients: string[];

  // Reactive Form and Matcher
  parentForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 60];

  constructor(private plateService: PlatesService, private fb: FormBuilder) {
    this.parentForm = fb.group({
      description: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      file: ["", [Validators.required]],
      ingredients: ["", [Validators.required]],
      category: ["", [Validators.required]]
    });
  }

  ngOnInit() {}

  gettingIngredients(list) {
    this.listOfIngredients = list;
    console.log(this.listOfIngredients);
  }

  add() {
    let obj = {
      description: this.parentForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0],
      ingredients: this.parentForm.controls.ingredients.value,
      category: this.parentForm.controls.category.value
    };
    console.log(obj);
  }
}
