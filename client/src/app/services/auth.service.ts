import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map } from "rxjs/Operators";
import { SubjectService } from "./subject.service";
import { AuthSocialService } from "ng4-social-login";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private subjectService: SubjectService,
    private authSocialService: AuthSocialService
  ) {}

  authenticateUser(credentials) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http
      .post("http://localhost:3000/users/login", credentials, {
        headers
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user["token"]) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.subjectService.setCurrentUser(user);
          }

          return user;
        })
      );
  }

  provider(user) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http
      .post("http://localhost:3000/users/provider", user, {
        headers
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user["token"]) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            // this.currentUserSubject.next(user);
            this.subjectService.setCurrentUser(user);
          }

          return user;
        })
      );
  }

  logout(provider) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http
      .delete("http://localhost:3000/users/logout", {
        headers
      })
      .pipe(
        map(() => {
          // remove user from local storage
          localStorage.removeItem("currentUser");
          // this.currentUserSubject.next(null);
          this.subjectService.setCurrentUser(null);
          if (provider) {
            this.authSocialService.signOut();
          }
        })
      );
  }

  loggedIn() {
    return !this.helper.isTokenExpired();
  }
}
