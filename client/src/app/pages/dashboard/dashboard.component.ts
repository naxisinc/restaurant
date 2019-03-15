import { Component, OnInit } from "@angular/core";

import { VisitorsCounterService } from "src/app/services/visitorscounter.service";
import { DeviceCounterService } from "src/app/services/devicecounter.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  visitedRouteCounter: any;
  connectedDeviceCounter: any;
  mobileConn: number;
  desktopConn: number;

  today: number;
  lastWeek: number;
  lastMonth: number;
  lastThreeMonths: number;
  lastYear: number;
  all: number;

  constructor(
    private visitedRouteCounterService: VisitorsCounterService,
    private connectedDeviceCounterService: DeviceCounterService
  ) {}

  ngOnInit() {
    this.visitedRouteCounterService.getRoutesCounter().subscribe(
      succ => {
        this.visitedRouteCounter = succ;
        console.log(this.visitedRouteCounter);
      },
      err => console.log(err)
    );

    this.connectedDeviceCounterService.getDeviceCounter().subscribe(
      succ => {
        this.connectedDeviceCounter = succ;
        console.log(this.connectedDeviceCounter);

        // All connections in the history
        this.all = this.connectedDeviceCounter.length;

        let now = new Date(Date.now());
        console.log(now); // string
        console.log(Date.now()); //timestamp now
        console.log(Date.now() - 365); //timestamp now
        console.log(now.setDate(now.getDate() - 365)); //timestamp last year

        // // Getting the lastYear connections.
        // this.lastYear = this.connectedDeviceCounter.filter(x => {
        //   let date = new Date(x.counted_at);
        //   return date.getTime() >= Date.now() - 365;
        // }).length;
        // console.log(`lastYear: ${this.lastYear}`);

        // // Getting the lastThreeMonths connections.
        // this.lastThreeMonths = this.connectedDeviceCounter.filter(x => {
        //   let date = new Date(x.counted_at);
        //   return date.getTime() >= now.setDate(now.getDate() - 90);
        // }).length;
        // console.log(`lastThreeMonth: ${this.lastThreeMonths}`);

        // Getting the total of mobile connections.
        this.mobileConn = this.connectedDeviceCounter.filter(
          x => x.type === "mobile"
        ).length;
        console.log(`mobileConn: ${this.mobileConn}`);

        // Getting the total of desktop connections.
        this.desktopConn = this.connectedDeviceCounter.filter(
          x => x.type === "desktop"
        ).length;
        console.log(`desktopConn: ${this.desktopConn}`);

        // this.connectedDeviceCounter.forEach(connection => {

        // });
      },
      err => console.log(err)
    );
  }
}
