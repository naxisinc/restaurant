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

  aboutRoute: any;
  visitCounting() {
    this.visitorsCounterService.getRoutesCounter().subscribe(
      succ => {
        this.aboutRoute = succ;
        this.aboutRoute = this.aboutRoute.filter(
          x => x.counterId === "about"
        )[0];

        // Increase the visitor counter for menu
        this.visitorsCounterService.patchRoute(this.aboutRoute).subscribe(
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
