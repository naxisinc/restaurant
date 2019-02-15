import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommentsService } from "../../services/comments.service";
import { DialogsComponent } from "../../components/dialogs/dialogs.component";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: Object;
  reply: Boolean[] = [false];
  response: string; // store the admin reply text

  constructor(
    private commentsService: CommentsService,
    private router: Router,
    private dialog: MatDialog,
    private subject: SubjectService
  ) {}

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    let plateId = localStorage.getItem("plate");
    if (!plateId) {
      this.router.navigate(["/"]); // redirect home
    } else {
      this.commentsService.getCommentByPlateId(plateId).subscribe(
        succ => {
          this.comments = succ;
        },
        err => {
          //
        }
      );
    }
  }

  replyFn(index) {
    this.response = "";
    this.reply = [false];
    this.reply[index] = true;
  }

  openDialog(_id): void {
    // update the petitioner in the service
    let petitioner = {
      name: "post",
      id: _id
    };
    this.subject.changeDeletePetitioner(petitioner);

    const dialogRef = this.dialog.open(DialogsComponent, {
      width: "250px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentsService.deleteComment(result).subscribe(
          succ => {
            this.getComments();
          },
          err => {
            //
          }
        );
      } else {
        // console.log("Cancel button was pushed");
      }
    });
  }

  postingReply(commentId) {
    console.log(this.response);
    console.log(commentId);
  }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
