import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/Operators";
import { SubjectService } from "./subject.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private subjectService: SubjectService,
    private authService: AuthService
  ) {}

  postUser(user) {
    let payload = new FormData();
    payload.append("name", user.name);
    payload.append("email", user.email);
    payload.append("password", user.password);
    payload.append("file", user.avatar);
    return this.http.post("http://localhost:3000/users", payload).pipe(
      map(user => {
        // console.log(user);
        // login successful if there's a jwt token in the response
        if (user["token"] && user["user"]["provider"] !== "LOCAL") {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.subjectService.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  patchUser(user) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.patch("http://localhost:3000/users/" + user._id, user, {
      headers
    });
  }

  checkEmailNotTaken(email) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post("http://localhost:3000/users/vent", email, {
      headers
    });
  }

  // Step 1
  sendEmailVerification(data) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(
      "http://localhost:3000/users/email-verification",
      data,
      {
        headers
      }
    );
  }

  // Step 2
  tokenValidation(token) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http
      .post("http://localhost:3000/users/token-validation", token, {
        headers
      })
      .pipe(
        map(user => {
          // console.log(user);
          // if canRecover is undefined | null | false was a sign-up request
          if (!user["canRecover"]) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.subjectService.setCurrentUser(user);
          }

          return user;
        })
      );
  }
}
