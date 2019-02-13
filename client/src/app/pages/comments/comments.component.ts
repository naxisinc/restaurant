import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: Object;

  constructor(
    private commentsService: CommentsService,
    private router: Router
  ) {}

  ngOnInit() {
    let plateId = localStorage.getItem("plate");
    if (!plateId) {
      this.router.navigate(["/"]); // redirect home
    } else {
      this.commentsService.getCommentByPlateId(plateId).subscribe(
        succ => {
          this.comments = succ;
          // console.log(this.comments);
        },
        err => {
          //
        }
      );
    }
  }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
