import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { CommentsAdminService } from "../../../services/admin/comments-admin.service";
import { DialogsComponent } from "../../../components/dialogs/dialogs.component";
import { SubjectService } from "src/app/services/subject.service";
import { PlatesService } from "../../../services/plates.service";

@Component({
  selector: "app-comments-admin",
  templateUrl: "./comments-admin.component.html",
  styleUrls: ["./comments-admin.component.scss"]
})
export class CommentsAdminComponent implements OnInit, OnDestroy {
  comments: Object;
  reply: Boolean[] = [false];
  response: string; // store the admin reply text
  petitioner: Object; // delete petitioner can by 'post' or 'reply'
  plateId: String = localStorage.getItem("plate");
  items: any; // Items del carousel
  @ViewChild("tpl", { read: TemplateRef }) tpl: TemplateRef<null>;

  constructor(
    private commentsAdminService: CommentsAdminService,
    private router: Router,
    private dialog: MatDialog,
    private subject: SubjectService,
    private platesService: PlatesService
  ) {}

  async ngOnInit() {
    await this.getPlates();
    if (this.plateId) {
      /* Aqui va la selection del plato en el carousel */
      this.onSelectedItem(this.plateId);
    } else {
      this.onSelectedItem(this.items[0]._id);
    }
  }

  async getPlates() {
    this.items = await this.platesService.getPlates().toPromise();
  }

  onSelectedItem(plateId) {
    this.commentsAdminService.getCommentByPlateId(plateId).subscribe(
      succ => {
        this.comments = succ;
      },
      err => {
        //
      }
    );
  }

  // getComments() {
  //   if (!this.plateId) {
  //     this.router.navigate(["/"]); // redirect home
  //   } else {
  //     this.commentsAdminService.getCommentByPlateId(this.plateId).subscribe(
  //       succ => {
  //         this.comments = succ;
  //       },
  //       err => {
  //         //
  //       }
  //     );
  //   }
  // }

  // replyFn(index) {
  //   this.response = "";
  //   this.reply = [false];
  //   this.reply[index] = true;
  // }

  // openDialog(_id, petitioner): void {
  //   // update the petitioner in the SubjectService
  //   this.petitioner = {
  //     name: petitioner,
  //     id: _id
  //   };
  //   this.subject.changeDeletePetitioner(this.petitioner);

  //   const dialogRef = this.dialog.open(DialogsComponent, {
  //     width: "300px",
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(data => {
  //     if (data) {
  //       if (data.name === "post") {
  //         this.commentsAdminService.deleteComment(data.id).subscribe(
  //           succ => {
  //             this.getComments();
  //           },
  //           err => {
  //             //
  //           }
  //         );
  //       } else if (data.name === "reply") {
  //         this.response = "";
  //         this.postingReply(data.id);
  //       }
  //     } else {
  //       // console.log("Cancel button was pushed");
  //     }
  //   });
  // }

  // postingReply(commentId) {
  //   let obj = {
  //     id: commentId,
  //     reply: this.response
  //   };
  //   this.commentsAdminService.patchComment(obj).subscribe(
  //     succ => {
  //       this.reply = [false];
  //       this.response = "";
  //       this.getComments();
  //     },
  //     err => {
  //       //
  //     }
  //   );
  // }

  // loadEdit(index) {
  //   this.reply[index] = true;
  //   this.response = this.comments[index].reply;
  //   this.comments[index].reply = "";
  // }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
