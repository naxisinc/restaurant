import { Component, OnInit } from "@angular/core";
import { VisitorsCounterService } from "src/app/services/visitorscounter.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  constructor(private visitorsCounterService: VisitorsCounterService) {}

  ngOnInit() {
    this.visitCounting();
  }

  async visitCounting() {
    try {
      let obj = { route: "menu" };
      await this.visitorsCounterService.increaseCounter(obj).toPromise();
    } catch (err) {
      console.log(err);
    }
  }
}
