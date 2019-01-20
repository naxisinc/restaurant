import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlatesService {
  constructor(private http: HttpClient) {}

  getPlates() {
    return this.http.get('http://localhost:3000/plates');
  }

  postPlate(plate) {
    let payload = new FormData();
    payload.append('_ingredients', JSON.stringify(plate._ingredients));
    payload.append('_category', plate.category);
    payload.append('file', plate.file);
    payload.append('description', plate.description);
    payload.append('details', JSON.stringify(plate.sizeDetails));
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.post('http://localhost:3000/plates', payload, {
      headers
    });
  }

  patchPlate(plate) {
    let payload = new FormData();
    payload.append('description', plate.description);
    payload.append('file', plate.file);
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.patch(
      'http://localhost:3000/plates/' + plate.id,
      payload,
      {
        headers
      }
    );
  }

  deletePlate(id) {
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.delete('http://localhost:3000/plates/' + id, {
      headers
    });
  }
}
