import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CustomValidator } from "src/app/services/validator.service";
import { SubjectService } from "src/app/services/subject.service";
import { Router } from "@angular/router";
import { IngredientsService } from "src/app/services/ingredients.service";

@Component({
  selector: "app-ingredients-form",
  templateUrl: "./ingredients-form.component.html",
  styleUrls: ["./ingredients-form.component.scss"]
})
export class IngredientsFormComponent implements OnInit {
  // Form Validators
  IngredientForm = this.fb.group({
    description: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    ],
    file: ["", [Validators.required, this.customValidator.validatingExt]]
  });

  isSelected: boolean = false;
  selected: Object;
  @ViewChild("fileInput") fileInput;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomValidator,
    private subjectService: SubjectService,
    private router: Router,
    private ingredientService: IngredientsService
  ) {}

  ngOnInit() {
    this.subjectService.ingredientSelected.subscribe(
      succ => {
        if (succ !== null) {
          this.selected = succ;
          this.IngredientForm.controls.description.patchValue(
            this.selected["description"]
          );
          this.isSelected = true;
        }
      },
      err => console.log(err)
    );
  }

  add() {
    let obj = {
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };

    this.ingredientService.postIngredient(obj).subscribe(
      succ => {
        this.clearEverything();
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
      description: this.IngredientForm.controls.description.value,
      file: this.fileInput.nativeElement.files[0]
    };
    this.ingredientService.patchIngredient(obj).subscribe(
      succ => {
        this.clearEverything();
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
    this.ingredientService.deleteIngredient(this.selected["_id"]).subscribe(
      succ => {
        this.IngredientForm.reset();
        this.clearEverything();
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
    this.selected = null;
    this.isSelected = false;
    this.IngredientForm.reset();
    this.subjectService.setItemSelectedFlag(false);
  }

  clearEverything() {
    this.isSelected = false;
    this.IngredientForm.reset();
    this.subjectService.setItemSelectedFlag(false);
    this.subjectService.ingredientDataSourceRefresh();
  }

  ngOnDestroy() {
    this.subjectService.setIngredientSelect(null);
  }
}
