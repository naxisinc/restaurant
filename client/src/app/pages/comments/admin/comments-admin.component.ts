import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { CommentsAdminService } from "../../../services/admin/comments-admin.service";
import { DialogsComponent } from "../../../components/dialogs/dialogs.component";
import { SubjectService } from "src/app/services/subject.service";
import { PlatesService } from "../../../services/plates.service";
// import { CategoriesService } from "../../../services/categories.service";

@Component({
  selector: "app-comments-admin",
  templateUrl: "./comments-admin.component.html",
  styleUrls: ["./comments-admin.component.scss"],
  providers: [NgbCarouselConfig] // add NgbCarouselConfig to the component providers
})
export class CommentsAdminComponent implements OnInit, OnDestroy {
  comments: Object;
  reply: Boolean[] = [false];
  response: string; // store the admin reply text
  petitioner: Object; // delete petitioner can by 'post' or 'reply'
  plateId: String = localStorage.getItem("plate");
  plates: any;

  // Esto no lo necesito pero lo tengo q poner
  // para poder usar el mismo <app-select> de dishes
  // parentForm = this.fb.group({
  //   category: ["", [Validators.required]]
  // });

  constructor(
    private commentsAdminService: CommentsAdminService,
    private router: Router,
    private dialog: MatDialog,
    private subject: SubjectService,
    private platesService: PlatesService,
    // private categoriesService: CategoriesService,
    private fb: FormBuilder,
    config: NgbCarouselConfig
  ) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = true; // Whether can wrap from the last to the first slide. Default true
    config.keyboard = false; //A flag for allowing navigation via keyboard. Default true
    config.pauseOnHover = true;
  }

  ngOnInit() {
    this.getPlates();
  }

  getPlates() {
    this.platesService.getPlates().subscribe(
      succ => {
        this.plates = succ;
        // Put the image path
        this.plates.forEach(plate => {
          plate.img = "http://localhost:3000/images/" + plate.img;
        });
      },
      err => {
        //
      }
    );
  }

  onSlideEvent(event) {
    console.log(event.current);
    // this.currentSlide = event.current;
    // this.slide.emit({
    //   current: this.currentPic
    // })
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

  // receiveCategory(event) {
  //   console.log(event.value);
  // }

  ngOnDestroy() {
    localStorage.removeItem("plate");
  }
}
