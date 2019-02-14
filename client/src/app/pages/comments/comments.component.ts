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

  constructor(
    private commentsService: CommentsService,
    private router: Router,
    private dialog: MatDialog,
    private subject: SubjectService
  ) {}

  ngOnInit() {
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
    this.reply = [false];
    this.reply[index] = !this.reply[index];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: "250px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
