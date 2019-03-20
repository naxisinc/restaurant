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
import { UserService } from "src/app/services/user.service";

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
    private authService: AuthService,
    private userService: UserService
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
      // adjusting user array
      this.user["password"] = this.user.id;
      delete this.user.id;
      this.user["avatar"] = this.user.photoUrl;
      delete this.user.photoUrl;

      const provider = await this.authService.provider(this.user).toPromise();
      if (!provider) {
        await this.userService.postUser(this.user).toPromise();
      } else {
        // Actualiza por si el user cambio algo en
        // la plataforma externa y debe ser actualizado
        // localmente, digase name, email or avatar
        await this.userService.patchUser(provider).toPromise();
      }

      // Redirect from Dashboard
      this.router.navigate(["home"]);
      this.authSocialService.signOut();
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
