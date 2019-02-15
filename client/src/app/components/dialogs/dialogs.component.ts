import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { SubjectService } from "../../services/subject.service";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: "app-dialogs",
  templateUrl: "./dialogs.component.html",
  styleUrls: ["./dialogs.component.scss"]
})
export class DialogsComponent implements OnInit {
  petitioner: object;

  constructor(
    private subject: SubjectService,
    private commentsService: CommentsService
  ) {}

  ngOnInit() {
    // https://stackoverflow.com/questions/51478183/behaviorsubject-subscriber-gets-same-next-element-multiple-times/51478704
    this.subject.currentDeletePetitioner.pipe(first()).subscribe(petitioner => {
      this.petitioner = petitioner;
    });
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
}
