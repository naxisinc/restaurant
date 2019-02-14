import { Component, OnInit } from "@angular/core";
import { SubjectService } from "../../services/subject.service";

@Component({
  selector: "app-dialogs",
  templateUrl: "./dialogs.component.html",
  styleUrls: ["./dialogs.component.scss"]
})
export class DialogsComponent implements OnInit {
  petitioner: string;

  constructor(private subject: SubjectService) {}

  ngOnInit() {
    this.subject.currentDeletePetitioner.subscribe(petitioner => {
      this.petitioner = petitioner;
    });
  }
}
