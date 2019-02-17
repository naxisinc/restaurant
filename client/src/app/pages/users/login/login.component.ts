import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  hide = true;
  headers: any;

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {}

  onLogin() {
    let credentials = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    };
    this.authService.authenticateUser(credentials).subscribe(
      res => {
        // Storing the token in the localStorage
        res.headers.keys().map(key => {
          if (key === "x-auth") {
            const token = res.headers.get(key);
            localStorage.setItem("x-auth", token);
          }
        });
        // Redirect from Dashboard
        this.router.navigate(["home"]);
        // Show Success Message
        // this.toast.success("Welcome to Air Technik Inc.");
      },
      err => {
        console.log(err);
      }
    );
  }
}
