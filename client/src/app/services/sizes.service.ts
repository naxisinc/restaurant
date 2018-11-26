import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SizesService {
  constructor(private http: HttpClient) {}

  // Private route
  getSizes() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': localStorage.getItem('x-auth')
    });
    return this.http.get('http://localhost:3000/sizes', { headers });
  }
}
