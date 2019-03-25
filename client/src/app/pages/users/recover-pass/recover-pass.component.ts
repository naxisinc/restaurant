import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { CustomValidator } from "src/app/services/validator.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-recover-pass",
  templateUrl: "./recover-pass.component.html",
  styleUrls: ["./recover-pass.component.scss"]
})
export class RecoverPassComponent implements OnInit {
  wasSent: Boolean = false;
  message: string =
    "An email was sent to your inbox.Please check it and follow the instructions.";

  // Reactive Form
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.recoverForm = this.fb.group({
      email: [
        "",
        [Validators.required, Validators.email],
        CustomValidator.ValidateEmailExist(this.userService)
      ]
    });
  }

  recover() {
    let obj = {
      email: this.recoverForm.controls.email.value
    };
    this.userService.sendEmailVerification(obj).subscribe(
      succ => {
        this.recoverForm.reset();
        this.wasSent = true;
      },
      err => console.log(err)
    );
  }
}
