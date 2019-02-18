import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { CommentsAdminService } from "../../../services/admin/comments-admin.service";
import { DialogsComponent } from "../../../components/dialogs/dialogs.component";
import { SubjectService } from "src/app/services/subject.service";
import { PlatesService } from "../../../services/plates.service";
import { CategoriesService } from "../../../services/categories.service";

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
  plate: Object;
  images = [1, 2, 3].map(
    () => `https://picsum.photos/900/500?random&t=${Math.random()}`
  );

  // Esto no lo necesito pero lo tengo q poner
  // para poder usar el mismo <app-select> de dishes
  parentForm = this.fb.group({
    category: ["", [Validators.required]]
  });

  constructor(
    private commentsAdminService: CommentsAdminService,
    private router: Router,
    private dialog: MatDialog,
    private subject: SubjectService,
    private platesService: PlatesService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.plateId) {
      // Si viene de la vista 'Dishes' con un plato especifico
      console.log(this.plateId);
    } else {
      // Si viene de clickear 'Comments'
      console.log(this.plateId);
    }
    // this.platesService.getPlate(this.plateId).subscribe(
    //   succ => {
    //     this.imgPath = "http://localhost:3000/images/" + succ["img"];
    //     this.plateDescription = succ["description"];
    //     // console.log(succ);
    //     this.plate = succ;
    //   },
    //   err => {
    //     //
    //   }
    // );
    // this.getComments();
  }

  getComments() {
    if (!this.plateId) {
      this.router.navigate(["/"]); // redirect home
    } else {
      this.commentsAdminService.getCommentByPlateId(this.plateId).subscribe(
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

  openDialog(_id, petitioner): void {
    // update the petitioner in the SubjectService
    this.petitioner = {
      name: petitioner,
      id: _id
    };
    this.subject.changeDeletePetitioner(this.petitioner);

    const dialogRef = this.dialog.open(DialogsComponent, {
      width: "300px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.name === "post") {
          this.commentsAdminService.deleteComment(data.id).subscribe(
            succ => {
              this.getComments();
            },
            err => {
              //
            }
          );
        } else if (data.name === "reply") {
          this.response = "";
          this.postingReply(data.id);
        }
      } else {
        // console.log("Cancel button was pushed");
      }
    });
  }

  postingReply(commentId) {
    let obj = {
      id: commentId,
      reply: this.response
    };
    this.commentsAdminService.patchComment(obj).subscribe(
      succ => {
        this.reply = [false];
        this.response = "";
        this.getComments();
      },
      err => {
        //
      }
    );
  }

  loadEdit(index) {
    this.reply[index] = true;
    this.response = this.comments[index].reply;
    this.comments[index].reply = "";
  }

  receiveCategory(event) {
    console.log(event.value);
  }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
