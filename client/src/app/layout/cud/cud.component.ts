import { Component, OnInit } from "@angular/core";

import { SubjectService } from "../../services/subject.service";

@Component({
  selector: "app-cud",
  templateUrl: "./cud.component.html",
  styleUrls: ["./cud.component.scss"]
})
export class CudComponent implements OnInit {
  route: string;

  constructor(private subjectService: SubjectService) {
    this.subjectService.currentRoute.subscribe(res => (this.route = res));
  }

  ngOnInit() {}
}
