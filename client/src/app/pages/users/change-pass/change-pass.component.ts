import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { CustomValidator } from "src/app/services/validator.service";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-pass",
  templateUrl: "./change-pass.component.html",
  styleUrls: ["./change-pass.component.scss"]
})
export class ChangePassComponent implements OnInit {
  hide = true;
  data = [];

  changePasswordForm = this.fb.group(
    {
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
    },
    {
      validator: CustomValidator.MatchPassword // my validator method
    }
  );

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.data = this.router.url.split("/").slice(2);
  }

  changePassword() {
    let obj = {
      _id: this.data[0],
      password: this.changePasswordForm.controls.password.value,
      token: this.data[1]
    };
    this.userService.patchUser(obj).subscribe(
      succ => {
        this.router.navigate(["/"]);
      },
      err => console.log(err)
    );
  }
}
