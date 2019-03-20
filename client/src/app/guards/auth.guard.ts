import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { SubjectService } from "../services/subject.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  currentUser: any;

  constructor(private subjectService: SubjectService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // subscribe for catch the current user
    this.subjectService.currentUser.subscribe(
      succ => {
        this.currentUser = succ;
      },
      err => console.log(err)
    );

    if (this.currentUser) {
      // check if route is restricted by role
      if (
        route.data.roles &&
        route.data.roles.indexOf(this.currentUser.role) === -1
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
