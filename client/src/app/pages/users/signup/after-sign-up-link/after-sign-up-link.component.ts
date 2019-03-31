import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-after-sign-up-link",
  template: `
    <h1 style="margin: 4rem auto; width:600px;">
      {{ msg }}
    </h1>
  `,
  styles: []
})
export class AfterSignUpLinkComponent implements OnInit, OnDestroy {
  user: any;
  msg: string;
  private subscriptions$ = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    let obj = {
      token: this.router.url.split("/").pop()
    };
    // console.log(obj);
    this.subscriptions$.push(
      this.userService.tokenValidation(obj).subscribe(
        res => {
          this.user = res;
          // Fue un recovery password request
          if (this.user.canRecover) {
            this.router.navigate([
              "/change-password/" + this.user._id + "/" + this.user.token
            ]);
          }
          // sign-up request
          else {
            this.router.navigate(["/"]);
          }
        },
        err => console.log(err)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
