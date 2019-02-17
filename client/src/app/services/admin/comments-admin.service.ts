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
      "x-auth": localStorage.getItem("x-auth")
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
      "x-auth": localStorage.getItem("x-auth")
    });
    return this.http.delete("http://localhost:3000/admin/comments/" + id, {
      headers
    });
  }
}
