import { Component, OnInit } from "@angular/core";
import {
  AuthSocialService,
  FacebookLoginProvider,
  // GoogleLoginProvider,
  // LinkedinLoginProvider,
  SocialUser
} from "ng4-social-login";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-facebook",
  templateUrl: "./facebook.component.html",
  styleUrls: ["./facebook.component.scss"]
})
export class FacebookComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;

  constructor(
    private authSocialService: AuthSocialService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  // signInWithGoogle(): void {
  //   this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  async signInWithFB() {
    try {
      this.user = await this.authSocialService.signIn(
        FacebookLoginProvider.PROVIDER_ID
      );
      console.log(this.user);

      this.authService.doMeAToken(this.user).subscribe(
        res => {
          // console.log(res);
          // Storing the token in the localStorage
          res.headers.keys().map(key => {
            if (key === "x-auth") {
              const token = res.headers.get(key);
              localStorage.setItem("x-auth", token);
              localStorage.setItem("provider", this.user.provider);
            }
          });
        },
        err => console.log(err)
      );

      // Redirect from Dashboard
      this.router.navigate(["home"]);
    } catch (e) {
      console.log(e);
    }
  }

  // signInWithLinkedIN(): void {
  //   this.authSocialService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  // }

  signOut(): void {
    this.authSocialService.signOut();
  }
}
