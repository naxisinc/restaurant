import { Component, OnInit } from "@angular/core";
import {
  AuthSocialService,
  FacebookLoginProvider,
  SocialUser
} from "ng4-social-login";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-facebook",
  templateUrl: "./facebook.component.html",
  styleUrls: ["./facebook.component.scss"]
})
export class FacebookComponent implements OnInit {
  private user: SocialUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private authSocialService: AuthSocialService
  ) {}

  ngOnInit() {}

  async signInWithFB() {
    try {
      this.user = await this.authSocialService.signIn(
        FacebookLoginProvider.PROVIDER_ID
      );
      // adjusting user array
      this.user["password"] = this.user.id;
      delete this.user.id;
      this.user["avatar"] = this.user.photoUrl;
      delete this.user.photoUrl;

      await this.authService.authenticateProvider(this.user).toPromise();

      // Redirect from Dashboard
      this.router.navigate(["home"]);
    } catch (e) {
      console.log(e);
    }
  }

  // downloadPhoto(url) {
  //   var link = document.createElement("a");
  //   link.download = "image.jpg";
  //   link.href = url;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   // delete link;
  // }
}
