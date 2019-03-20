import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SizesService {
  constructor(private http: HttpClient) {}

  getSizes() {
    return this.http.get("http://localhost:3000/sizes");
  }

  postSize(size) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.post("http://localhost:3000/sizes", size, { headers });
  }

  patchSize(size) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.patch("http://localhost:3000/sizes/" + size.id, size, {
      headers
    });
  }

  deleteSize(id) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.delete("http://localhost:3000/sizes/" + id, {
      headers
    });
  }
}
