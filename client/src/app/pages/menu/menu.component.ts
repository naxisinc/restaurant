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

  menuRoute: any;
  visitCounting() {
    this.visitorsCounterService.getRoutesCounter().subscribe(
      succ => {
        this.menuRoute = succ;
        this.menuRoute = this.menuRoute.filter(x => x.counterId === "menu")[0];

        // Increase the visitor counter for menu
        this.visitorsCounterService.patchRoute(this.menuRoute).subscribe(
          succ => {
            // console.log('increased succesfully');
          },
          err => console.log(err)
        );
      },
      err => console.log(err)
    );
  }
}
