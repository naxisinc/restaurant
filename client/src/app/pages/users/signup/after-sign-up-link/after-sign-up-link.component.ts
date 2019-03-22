import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-after-sign-up-link",
  template: `
    <app-not-found></app-not-found>
  `,
  styles: []
})
export class AfterSignUpLinkComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    let obj = {
      token: this.router.url.split("/").pop()
    };
    this.userService.tokenValidation(obj).subscribe(
      res => {
        this.router.navigate(["/"]);
      },
      err => console.log(err)
    );
  }
}
