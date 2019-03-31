import { Component, OnInit } from "@angular/core";
import { VisitorsCounterService } from "src/app/services/visitorscounter.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
  constructor(private visitorsCounterService: VisitorsCounterService) {}

  ngOnInit() {
    this.visitCounting();
  }

  async visitCounting() {
    try {
      let obj = { route: "about" };
      await this.visitorsCounterService.increaseCounter(obj).toPromise();
    } catch (err) {
      console.log(err);
    }
  }
}
