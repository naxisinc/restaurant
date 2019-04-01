import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

import { CommentsAdminService } from "../../../services/admin/comments-admin.service";
import { DialogsComponent } from "../../../components/dialogs/dialogs.component";
import { PlatesService } from "../../../services/plates.service";

@Component({
  selector: "app-comments-admin",
  templateUrl: "./comments-admin.component.html",
  styleUrls: ["./comments-admin.component.scss"]
})
export class CommentsAdminComponent implements OnInit, OnDestroy {
  reply: Boolean[] = [false];
  response: string; // store the admin reply text
  petitioner: Object; // delete petitioner can by 'post' or 'reply'
  plateId: String = localStorage.getItem("plate");
  plateIndex: number = parseInt(localStorage.getItem("index"));
  plates: any; // Items del carousel

  public config: SwiperConfigInterface = {
    a11y: true,
    slidesPerView: 2,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      hideOnClick: false
    }
  };

  constructor(
    private commentsAdminService: CommentsAdminService,
    private dialog: MatDialog,
    private platesService: PlatesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.config.initialSlide = this.plateIndex ? this.plateIndex : 0;
    this.getData();
  }

  commentsOfSelectedPlate: Array<Object>;
  onIndexChange(index) {
    this.commentsOfSelectedPlate = this.plates[index].comments;
  }

  // async getData() {
  //   try {
  //     this.plates = await this.platesService.getPlates().toPromise();
  //     console.log(this.plates);

  //     // for (let i = 0; i < this.plates.length; i++) {
  //     //   console.log(
  //     //     await this.commentsAdminService.getCommentByPlateId(
  //     //       this.plates[i]._id
  //     //     )
  //     //   );
  //     // }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  getData() {
    this.platesService.getPlates().subscribe(
      succ => {
        this.plates = succ;
        this.plates.forEach((plate, index) => {
          this.commentsAdminService.getCommentByPlateId(plate._id).subscribe(
            succ => {
              this.plates[index].comments = succ;
              if (this.plateId && this.plates[index]._id === this.plateId) {
                this.commentsOfSelectedPlate = this.plates[index].comments;
              } else if (!this.plateId && index === 0) {
                this.commentsOfSelectedPlate = this.plates[0].comments;
              }
            },
            err => console.log(err)
          );
        });
      },
      err => console.log(err)
    );
  }

  replyFn(index) {
    this.response = "";
    this.reply = [false];
    this.reply[index] = true;
  }

  openDialog(_id, petitioner): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: "300px",
      data: {
        dialogId: "delete",
        petitionerName: petitioner,
        petitionerId: _id
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.petitionerName === "post") {
          // Delete comment from database
          this.commentsAdminService.deleteComment(data.petitionerId).subscribe(
            succ => {
              // Update view array
              this.commentsOfSelectedPlate = this.commentsOfSelectedPlate.filter(
                comment => comment["_id"] !== data.petitionerId
              );
            },
            err => {
              // Unauthorized
              if (err.status === 401) {
                this.router.navigate(["login"]);
              } else console.log(err);
            }
          );
        } else if (data.petitionerName === "reply") {
          this.response = "";
          this.postingReply(data.petitionerId);
        }
      } else {
        // console.log("Dialog was close");
      }
    });
  }

  postingReply(commentId) {
    let obj = {
      id: commentId,
      reply: this.response
    };
    // Modify the comment in the database
    this.commentsAdminService.patchComment(obj).subscribe(
      succ => {
        // Update view array
        this.commentsOfSelectedPlate.forEach(comment => {
          if (comment["_id"] === commentId) {
            comment["reply"] = this.response;
          }
        });
        this.reply = [false];
        this.response = "";
      },
      err => {
        // Unauthorized
        if (err.status === 401) {
          this.router.navigate(["login"]);
        } else console.log(err);
      }
    );
  }

  loadEdit(index) {
    this.reply[index] = true;
    this.response = this.commentsOfSelectedPlate[index]["reply"];
    this.commentsOfSelectedPlate[index]["reply"] = "";
  }

  ngOnDestroy() {
    localStorage.removeItem("plate");
    localStorage.removeItem("index");
  }
}
