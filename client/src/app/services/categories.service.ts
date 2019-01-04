import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get('http://localhost:3000/categories');
  }

  postCategory(category) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.post('http://localhost:3000/categories', category, {
      headers
    });
  }

  patchCategory(category) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.patch(
      'http://localhost:3000/categories/' + category.id,
      category,
      {
        headers
      }
    );
  }

  deleteCategory(id) {
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.delete('http://localhost:3000/categories/' + id, {
      headers
    });
  }
}
