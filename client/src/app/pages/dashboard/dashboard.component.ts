import { Component, OnInit } from "@angular/core";

import { VisitorsCounterService } from "../../services/visitorscounter.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  visitorsCounter: Object;

  constructor(private visitorsCounterService: VisitorsCounterService) {}

  ngOnInit() {
    this.visitorsCounterService.getRoutesCounter().subscribe(
      succ => {
        this.visitorsCounter = succ;
      },
      err => console.log(err)
    );
  }
}
