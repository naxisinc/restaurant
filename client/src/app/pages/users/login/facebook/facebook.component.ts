import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  FacebookLoginProvider,
  // GoogleLoginProvider,
  // LinkedinLoginProvider,
  SocialUser
} from "ng4-social-login";
import { Router } from "@angular/router";

@Component({
  selector: "app-facebook",
  templateUrl: "./facebook.component.html",
  styleUrls: ["./facebook.component.scss"]
})
export class FacebookComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  async signInWithFB() {
    try {
      this.user = await this.authService.signIn(
        FacebookLoginProvider.PROVIDER_ID
      );
      console.log(this.user);
      // Redirect from Dashboard
      this.router.navigate(["home"]);
    } catch (e) {
      console.log(e);
    }
  }

  // signInWithLinkedIN(): void {
  //   this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  // }

  signOut(): void {
    this.authService.signOut();
  }
}
