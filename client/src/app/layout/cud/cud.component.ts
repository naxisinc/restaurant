import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";

import { SubjectService } from "../../services/subject.service";

@Component({
  selector: "app-cud",
  templateUrl: "./cud.component.html",
  styleUrls: ["./cud.component.scss"]
})
export class CudComponent implements OnInit {
  route: string;

  constructor(private router: Router, private subjectService: SubjectService) {
    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.route = event.url.split("/").pop();
        this.subjectService.changeRoute(this.route);
        // console.log(this.route);
      });
  }

  ngOnInit() {}
}
