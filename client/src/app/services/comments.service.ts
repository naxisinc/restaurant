import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommentsService {
  private messageSource = new BehaviorSubject(null);
  currentPlate = this.messageSource.asObservable();

  constructor(private http: HttpClient) {}

  changePlate(plateId: string) {
    this.messageSource.next(plateId);
  }

  getCommentByPlateId(plateId) {
    return this.http.get("http://localhost:3000/comments/" + plateId);
  }
}
