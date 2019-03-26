import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

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
    private subjectService: SubjectService
  ) {
    this.subjectService.currentRoute.subscribe(route => {
      this.element = route;
    });
  }

  ngOnInit() {
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
      this.element === "sizes"
        ? await this.sizeService.postSize(obj).toPromise()
        : await this.categoryService.postCategory(obj).toPromise();

      this.clearEverything();
    } catch (e) {
      console.log(e);
    }
  }

  async edit() {
    try {
      let obj = {
        id: this.selected["_id"],
        description: this.elementFormControl.value
      };
      this.element === "sizes"
        ? await this.sizeService.patchSize(obj).toPromise()
        : await this.categoryService.patchCategory(obj).toPromise();

      this.clearEverything();
    } catch (e) {
      console.log(e);
    }
  }

  async delete() {
    try {
      let id = this.selected["_id"];
      this.element === "sizes"
        ? await this.sizeService.deleteSize(id).toPromise()
        : await this.categoryService.deleteCategory(id).toPromise();

      this.clearEverything();
    } catch (e) {
      console.log(e);
    }
  }

  cancel() {
    this.selected = null;
    this.isSelected = false;
    this.elementFormControl.reset();
    this.subjectService.setItemSelectedFlag(false);
  }

  clearEverything() {
    this.isSelected = false;
    this.elementFormControl.reset();
    this.subjectService.elementDataSourceRefresh();
    this.subjectService.setItemSelectedFlag(false);
  }

  ngOnDestroy() {
    this.subjectService.setElementSelect(null);
  }
}
