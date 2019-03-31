import { Component, OnInit, OnDestroy } from "@angular/core";

import { SubjectService } from "../../services/subject.service";

@Component({
  selector: "app-cud",
  templateUrl: "./cud.component.html",
  styleUrls: ["./cud.component.scss"]
})
export class CudComponent implements OnInit, OnDestroy {
  route: string;
  private subscriptions$ = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.subscriptions$.push(
      this.subjectService.currentRoute.subscribe(res => (this.route = res))
    );
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
