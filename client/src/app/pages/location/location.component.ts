import { Component, OnInit } from "@angular/core";
import { VisitorsCounterService } from "src/app/services/visitorscounter.service";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"]
})
export class LocationComponent implements OnInit {
  constructor(private visitorsCounterService: VisitorsCounterService) {}

  ngOnInit() {
    this.visitCounting();
  }

  async visitCounting() {
    try {
      let obj = { route: "location" };
      await this.visitorsCounterService.increaseCounter(obj).toPromise();
    } catch (err) {
      console.log(err);
    }
  }
}
