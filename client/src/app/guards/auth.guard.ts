import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { SubjectService } from "../services/subject.service";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private subjectService: SubjectService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*
    The auth guard uses the authentication service to check if the user is logged in, if they are logged in it checks if their role is authorized to access the requested route.If they are logged in and authorized the canActivate() method reutrns true, otherwise it returns false and redirects the user to the login page.
    */
    if (this.authService.loggedIn()) {
      const currentUser = this.subjectService.currentUserValue.user;
      // check if route is restricted by role
      if (
        route.data.roles &&
        route.data.roles.indexOf(currentUser.role) === -1
      ) {
        // role not authorised so redirect to home page
        this.router.navigate(["/"]);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
