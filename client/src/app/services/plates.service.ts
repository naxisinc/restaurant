import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PlatesService {
  constructor(private http: HttpClient) {}

  getPlates() {
    return this.http.get("http://localhost:3000/plates");
  }

  getPlate(plate) {
    return this.http.get("http://localhost:3000/plates/" + plate);
  }

  postPlate(plate) {
    const headers = new HttpHeaders({
      // NO LLEVA Content-Type ponerlo y darme cuenta q no
      // lo necesitaba me hizo perder un dia entero antes de notarlo
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    let payload = new FormData();
    payload.append("_ingredients", JSON.stringify(plate._ingredients));
    payload.append("_category", plate._category);
    payload.append("file", plate.file);
    payload.append("description", plate.description);
    payload.append("details", JSON.stringify(plate.sizeDetails));
    return this.http.post("http://localhost:3000/plates", payload, {
      headers
    });
  }

  patchPlate(plate) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    let payload = new FormData();
    payload.append("description", plate.description);
    payload.append("file", plate.file);
    payload.append("_ingredients", JSON.stringify(plate._ingredients));
    payload.append("_category", plate._category);
    payload.append("details", JSON.stringify(plate.sizeDetails));
    return this.http.patch(
      "http://localhost:3000/plates/" + plate.id,
      payload,
      {
        headers
      }
    );
  }

  deletePlate(id) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.delete("http://localhost:3000/plates/" + id, {
      headers
    });
  }
}
