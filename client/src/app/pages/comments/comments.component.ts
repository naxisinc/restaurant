import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommentsService } from "../../services/comments.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
  comments: Object;

  constructor(
    private commentsService: CommentsService,
    private router: Router
  ) {}

  ngOnInit() {
    // .pipe(first()) only get the value once and then automatically unsubscribe.
    // If I remove that, the method is called multiple times
    this.commentsService.currentPlate.pipe(first()).subscribe(plateId => {
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
    });
  }
}
