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

  locationRoute: any;
  visitCounting() {
    this.visitorsCounterService.getRoutesCounter().subscribe(
      succ => {
        this.locationRoute = succ;
        this.locationRoute = this.locationRoute.filter(
          x => x.counterId === "location"
        )[0];

        // Increase the visitor counter for menu
        this.visitorsCounterService.patchRoute(this.locationRoute).subscribe(
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
