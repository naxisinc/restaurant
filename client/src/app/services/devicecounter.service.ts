import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DeviceCounterService {
  constructor(private http: HttpClient) {}

  getDeviceCounter() {
    return this.http.get("http://localhost:3000/devicecounter");
  }

  postDevice(device) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post("http://localhost:3000/devicecounter", device, {
      headers
    });
  }
}
