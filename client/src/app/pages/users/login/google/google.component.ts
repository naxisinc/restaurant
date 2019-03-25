import { Component, OnInit } from "@angular/core";
import {
  AuthSocialService,
  GoogleLoginProvider,
  SocialUser
} from "ng4-social-login";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-google",
  templateUrl: "./google.component.html",
  styleUrls: ["./google.component.scss"]
})
export class GoogleComponent implements OnInit {
  private user: SocialUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private authSocialService: AuthSocialService
  ) {}

  ngOnInit() {}

  // Esto no funciona para ello tengo q haber hosteado el site bajo un dominio authorized by google
  async signInWithGoogle() {
    try {
      this.user = await this.authSocialService.signIn(
        GoogleLoginProvider.PROVIDER_ID
      );

      console.log(this.user);

      // adjusting user array
      this.user["password"] = this.user.id;
      delete this.user.id;
      this.user["avatar"] = this.user.photoUrl;
      delete this.user.photoUrl;

      // Redirect from Dashboard
      this.router.navigate(["home"]);
    } catch (e) {
      console.log(e);
    }
  }
}
