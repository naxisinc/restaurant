import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class VisitorsCounterService {
  constructor(private http: HttpClient) {}

  getRoutesCounter() {
    return this.http.get("http://localhost:3000/visitorscounter");
  }

  postRoute(route) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem("x-auth")
    });
    return this.http.post("http://localhost:3000/visitorscounter", route, {
      headers
    });
  }

  patchRoute(route) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem("x-auth")
    });
    return this.http.patch(
      "http://localhost:3000/visitorscounter/" + route._id,
      route,
      {
        headers
      }
    );
  }

  deleteRoute(id) {
    const headers = new HttpHeaders({
      "x-auth": localStorage.getItem("x-auth")
    });
    return this.http.delete("http://localhost:3000/visitorscounter/" + id, {
      headers
    });
  }
}
