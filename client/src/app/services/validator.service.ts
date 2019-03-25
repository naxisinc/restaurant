import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { UserService } from "./user.service";
import { map } from "rxjs/operators";
// import { ErrorStateMatcher } from "@angular/material/core";

@Injectable({
  providedIn: "root"
})
/** Instantaneous Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(
//     control: FormControl | null,
//     form: FormGroupDirective | NgForm | null
//   ): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(
//       control &&
//       control.invalid &&
//       (control.dirty || control.touched || isSubmitted)
//     );
//   }
// }

// ===== CUSTOM VALIDATORS ======
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

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get("password").value;
    let confirmPassword = AC.get("confirmPassword").value;
    if (password !== confirmPassword) {
      AC.get("confirmPassword").setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }

  static ValidateEmailNotTaken(userService: UserService) {
    return (control: AbstractControl) => {
      let obj = { email: control.value };
      return userService.checkEmailNotTaken(obj).pipe(
        map(res => {
          return res ? null : { emailTaken: true };
        })
      );
    };
  }

  static ValidateEmailExist(userService: UserService) {
    return (control: AbstractControl) => {
      let obj = { email: control.value };
      return userService.checkEmailNotTaken(obj).pipe(
        map(res => {
          return !res ? null : { emailTaken: true };
        })
      );
    };
  }
}
