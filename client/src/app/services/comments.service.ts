import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  getCommentByPlateId(plateId) {
    return this.http.get("http://localhost:3000/comments/" + plateId);
  }
}
