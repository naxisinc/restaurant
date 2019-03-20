import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/Operators";
import { SubjectService } from "./subject.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private subjectService: SubjectService
  ) {}

  postUser(user) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http
      .post("http://localhost:3000/users", user, {
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

  patchUser(user) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.patch("http://localhost:3000/users/" + user._id, user, {
      headers
    });
  }
}
