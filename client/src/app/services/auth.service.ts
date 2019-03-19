import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/Operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  // Esto es para saber si user esta activo en la session
  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> {
    return this._userActionOccured.asObservable();
  }
  notifyUserAction() {
    this._userActionOccured.next();
  }

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private helper: JwtHelperService) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

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
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  doMeAToken(user) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post("http://localhost:3000/users/domeatoken", user, {
      headers
    });
  }

  /*verifyEmail(email) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post("http://localhost:3000/users/verify-email", email, {
      headers
    });
  }

  changePassword(data) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-auth": data.token
    });
    return this.http.patch(
      "http://localhost:3000/users/change-password",
      data,
      {
        headers
      }
    );
  }*/

  logout() {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http
      .delete("http://localhost:3000/users/logout", {
        headers
      })
      .pipe(
        map(() => {
          // remove user from local storage to log user out
          localStorage.removeItem("currentUser");
          this.currentUserSubject.next(null);
        })
      );
  }

  loggedIn() {
    return !this.helper.isTokenExpired();
  }
}
