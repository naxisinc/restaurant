import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UserService } from "src/app/services/user.service";
import { CustomValidator } from "src/app/services/validator.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  hide = true;
  wasSent = false;
  userAdded: any;
  message: string =
    "An email was sent to your inbox.Please check it and follow the instructions.";

  signUpForm = this.fb.group(
    {
      fullname: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
    },
    {
      validator: CustomValidator.MatchPassword // my validator method
    }
  );

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {}

  signUp() {
    // console.log(this.signUpForm.controls);
    let obj = {
      name: this.signUpForm.controls.fullname.value,
      email: this.signUpForm.controls.email.value,
      password: this.signUpForm.controls.password.value
    };
    // console.log(obj);
    this.userService.postUser(obj).subscribe(
      succ => {
        this.userAdded = succ;
        let obj = {
          token: this.userAdded.token
        };
        this.userService.sendEmailVerification(obj).subscribe(
          res => {
            this.signUpForm.reset();
            this.wasSent = true;
          },
          err => console.log(err)
        );
      },
      err => console.log(err)
    );
  }
}
