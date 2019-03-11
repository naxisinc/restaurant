import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { SizesService } from "src/app/services/sizes.service";
import { CategoriesService } from "src/app/services/categories.service";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-mixed-form",
  templateUrl: "./mixed-form.component.html",
  styleUrls: ["./mixed-form.component.scss"]
})
export class MixedFormComponent implements OnInit {
  element: string; // sizes OR categories
  table: any;

  // Form Validators
  elementFormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  isSelected: boolean = false;
  selected: Object;

  constructor(
    private sizeService: SizesService,
    private categoryService: CategoriesService,
    private subjectService: SubjectService,
    private router: Router
  ) {
    this.subjectService.currentRoute.subscribe(route => {
      this.element = route;
    });
  }

  ngOnInit() {
    this.subjectService.getTable.subscribe(
      succ => {
        if (succ !== null) {
          this.table = succ;
        }
      },
      err => console.log(err)
    );

    this.subjectService.elementSelected.subscribe(
      succ => {
        if (succ !== null) {
          this.selected = succ;
          this.elementFormControl.patchValue(this.selected["description"]);
          this.isSelected = true;
        }
      },
      err => console.log(err)
    );
  }

  async add() {
    try {
      let obj = { description: this.elementFormControl.value };
      const result =
        this.element === "sizes"
          ? await this.sizeService.postSize(obj).toPromise()
          : await this.categoryService.postCategory(obj).toPromise();
      if (result) {
        this.elementFormControl.reset();
        this.subjectService.setItemSelectedFlag(false);
        this.table.renderRows();
      }
    } catch (e) {
      console.log(e);
    }

    /*this.categoryService.postCategory(obj).subscribe(
      succ => {
        this.elementFormControl.reset();
        this.subjectService.categoryDataSourceRefresh();
        this.subjectService.setItemSelectedFlag(false);
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );*/
  }

  edit() {
    let obj = {
      id: this.selected["_id"],
      description: this.elementFormControl.value
    };
    this.categoryService.patchCategory(obj).subscribe(
      succ => {
        this.elementFormControl.reset();
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
        this.elementFormControl.reset();
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
    this.elementFormControl.reset();
    this.isSelected = false;
    this.selected = null;
    this.subjectService.setItemSelectedFlag(false);
  }

  ngOnDestroy() {
    this.subjectService.setElementSelect(null);
  }
}
