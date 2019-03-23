import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-recover-pass",
  templateUrl: "./recover-pass.component.html",
  styleUrls: ["./recover-pass.component.scss"]
})
export class RecoverPassComponent implements OnInit {
  recoverForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {}

  recover() {
    let obj = {
      email: this.recoverForm.controls.email.value
    };
    this.userService.sendEmailVerification(obj).subscribe(
      succ => {
        //
      },
      err => console.log(err)
    );
  }
}
