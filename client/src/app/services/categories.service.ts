import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get("http://localhost:3000/categories");
  }

  postCategory(category) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.post("http://localhost:3000/categories", category, {
      headers
    });
  }

  patchCategory(category) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.patch(
      "http://localhost:3000/categories/" + category.id,
      category,
      {
        headers
      }
    );
  }

  deleteCategory(id) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.delete("http://localhost:3000/categories/" + id, {
      headers
    });
  }
}
