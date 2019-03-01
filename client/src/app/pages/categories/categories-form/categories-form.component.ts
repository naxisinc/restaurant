import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { CategoriesService } from "src/app/services/categories.service";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.scss"]
})
export class CategoriesFormComponent implements OnInit {
  // Form Validators
  categoryFormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  isSelected: boolean = false;
  selected: Object;

  constructor(
    private categoryService: CategoriesService,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.subjectService.categorySelected.subscribe(
      succ => {
        if (succ !== null) {
          this.selected = succ;
          this.categoryFormControl.patchValue(this.selected["description"]);
          this.isSelected = true;
        }
      },
      err => console.log(err)
    );
  }

  add() {
    let obj = { description: this.categoryFormControl.value };
    this.categoryService.postCategory(obj).subscribe(
      succ => {
        this.categoryFormControl.reset();
        this.subjectService.categoryDataSourceRefresh();
        this.subjectService.setItemSelectedFlag(false);
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  edit() {
    let obj = {
      id: this.selected["_id"],
      description: this.categoryFormControl.value
    };
    this.categoryService.patchCategory(obj).subscribe(
      succ => {
        this.categoryFormControl.reset();
        this.isSelected = false;
        this.subjectService.categoryDataSourceRefresh();
        this.subjectService.setItemSelectedFlag(false);
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
    this.categoryService.deleteCategory(this.selected["_id"]).subscribe(
      succ => {
        this.categoryFormControl.reset();
        this.isSelected = false;
        this.subjectService.categoryDataSourceRefresh();
        this.subjectService.setItemSelectedFlag(false);
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
    this.categoryFormControl.reset();
    this.isSelected = false;
    this.selected = null;
    this.subjectService.setItemSelectedFlag(false);
  }
}
