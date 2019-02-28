import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { SizesService } from "../../../services/sizes.service";
import { SubjectService } from "../../../services/subject.service";

@Component({
  selector: "app-sizes-form",
  templateUrl: "./sizes-form.component.html",
  styleUrls: ["./sizes-form.component.scss"]
})
export class SizesFormComponent implements OnInit {
  // Form Validators
  sizeFormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  isSelected: boolean = false;
  selected: Object;

  constructor(
    private sizeService: SizesService,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.subjectService.sizeSelected.subscribe(
      succ => {
        if (succ !== null) {
          this.selected = succ;
          this.sizeFormControl.patchValue(this.selected["description"]);
          this.isSelected = true;
        }
      },
      err => console.log(err)
    );
  }

  add() {
    let obj = { description: this.sizeFormControl.value };
    this.sizeService.postSize(obj).subscribe(
      succ => {
        this.subjectService.sizeDataSourceRefresh();
        this.sizeFormControl.reset();
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
      description: this.sizeFormControl.value
    };
    this.sizeService.patchSize(obj).subscribe(
      succ => {
        this.subjectService.sizeDataSourceRefresh();
        this.sizeFormControl.reset();
        this.isSelected = false;
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
    this.sizeService.deleteSize(this.selected["_id"]).subscribe(
      succ => {
        this.subjectService.sizeDataSourceRefresh();
        this.sizeFormControl.reset();
        this.isSelected = false;
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
    this.sizeFormControl.reset();
    this.selected = null;
    this.isSelected = false;
    this.subjectService.setItemSelectedFlag(false);
  }
}
