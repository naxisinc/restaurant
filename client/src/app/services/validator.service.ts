import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  AbstractControl
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

@Injectable({
  providedIn: "root"
})
/** Instantaneous Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

// =========================== CUSTOM VALIDATORS =====================
@Injectable({
  providedIn: "root"
})
export class CustomValidator {
  validatingExt(filename: AbstractControl): { [key: string]: boolean } | null {
    if (filename.value !== undefined && isNaN(filename.value)) {
      let ext = filename.value
        .split("\\")
        .pop()
        .split(".")
        .pop();
      if (ext === "png" || ext === "jpg" || ext === "jpeg") return null;
      return { extension: true };
    }
    return null;
  }
}
