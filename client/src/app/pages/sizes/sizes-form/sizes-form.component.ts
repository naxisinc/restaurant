import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { SizesService } from "../../../services/sizes.service";

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

  @Output() refresh = new EventEmitter();

  constructor(private sizeService: SizesService, private router: Router) {}

  ngOnInit() {}

  add() {
    let obj = { description: this.sizeFormControl.value };
    this.sizeService.postSize(obj).subscribe(
      succ => {
        this.refresh.emit();
        this.sizeFormControl.reset();
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }
}
