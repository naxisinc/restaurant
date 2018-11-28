import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SizesService {
  constructor(private http: HttpClient) {}

  getSizes() {
    return this.http.get('http://localhost:3000/sizes');
  }

  postSize(size) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.post('http://localhost:3000/sizes', size, { headers });
  }

  patchSize(size) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.patch('http://localhost:3000/sizes/' + size.id, size, {
      headers
    });
  }

  deleteSize(id) {
    const headers = new HttpHeaders({
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.delete('http://localhost:3000/sizes/' + id, {
      headers
    });
  }
}
