import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommentsAdminService {
  constructor(private http: HttpClient) {}

  getCommentByPlateId(plateId) {
    return this.http.get("http://localhost:3000/admin/comments/" + plateId);
  }

  patchComment(comment) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.patch(
      "http://localhost:3000/admin/comments/" + comment.id,
      comment,
      {
        headers
      }
    );
  }

  deleteComment(id) {
    const headers = new HttpHeaders({
      token: JSON.parse(localStorage.getItem("currentUser")).token
    });
    return this.http.delete("http://localhost:3000/admin/comments/" + id, {
      headers
    });
  }
}
