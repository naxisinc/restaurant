import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //
  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> {
    return this._userActionOccured.asObservable();
  }

  notifyUserAction() {
    this._userActionOccured.next();
  }

  loginUser() {
    console.log("user login");
  }

  logOutUser() {
    console.log("user logout");
  }

  constructor(private http: HttpClient, private helper: JwtHelperService) {}

  authenticateUser(credentials) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post("http://localhost:3000/users/login", credentials, {
      headers,
      observe: "response"
    });
  }

  verifyEmail(email) {
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
  }

  logout() {
    const headers = new HttpHeaders({
      "x-auth": localStorage.getItem("x-auth")
    });
    return this.http.delete("http://localhost:3000/users/logout", {
      headers,
      observe: "response"
    });
  }

  loggedIn() {
    return !this.helper.isTokenExpired();
  }
}
