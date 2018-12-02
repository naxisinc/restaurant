import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  constructor(private http: HttpClient) {}

  getIngredients() {
    return this.http.get('http://localhost:3000/ingredients');
  }

  postIngredient(ingredient) {
    let payload = new FormData();
    payload.append('description', ingredient.description);
    payload.append('file', ingredient.file);
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.post('http://localhost:3000/ingredients', payload, {
      headers
    });
  }

  patchIngredient(ingredient) {
    let payload = new FormData();
    payload.append('description', ingredient.description);
    payload.append('file', ingredient.file);
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.patch(
      'http://localhost:3000/ingredients/' + ingredient.id,
      payload,
      {
        headers
      }
    );
  }

  deleteIngredient(id) {
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.delete('http://localhost:3000/ingredients/' + id, {
      headers
    });
  }
}
