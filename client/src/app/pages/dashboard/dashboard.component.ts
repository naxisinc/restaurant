import { Component, OnInit, OnDestroy } from "@angular/core";

import { VisitorsCounterService } from "src/app/services/visitorscounter.service";
import { DeviceCounterService } from "src/app/services/devicecounter.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // ===== Pie Chart Settings =====
  // @docs: https://plnkr.co/edit/1wyoTPr38ajgzUmOhMHi?p=info
  chartData: any;

  // view: any[] = [700, 400]; // la variacion del width pudiera hacerlo responsive
  view: any[] = [600, 400];

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };

  onSelect(event) {
    // console.log(event);
  }

  private subscriptions$ = [];

  // ===== VISITORS STATISTICS =====
  connectedDeviceCounter: any;
  mobileConn: number;
  desktopConn: number;
  timeArray = [86400, 604800, 2592000, 7776000, 31536000]; // 1D, 1W, 1M, 3M, 1Y
  // counter = []; // 1D, 1W, 1M, 3M, 1Y, ALL
  counterConn = [
    {
      label: "1D",
      value: 0
    },
    {
      label: "1W",
      value: 0
    },
    {
      label: "1M",
      value: 0
    },
    {
      label: "3M",
      value: 0
    },
    {
      label: "1Y",
      value: 0
    },
    {
      label: "ALL",
      value: 0
    }
  ];

  constructor(
    private visitedRouteCounterService: VisitorsCounterService,
    private connectedDeviceCounterService: DeviceCounterService
  ) {}

  ngOnInit() {
    this.subscriptions$.push(
      this.visitedRouteCounterService.getRoutesCounter().subscribe(
        succ => {
          this.chartData = succ;
        },
        err => console.log(err)
      )
    );

    this.subscriptions$.push(
      this.connectedDeviceCounterService.getDeviceCounter().subscribe(
        succ => {
          this.connectedDeviceCounter = succ;

          // Getting the All connections in the history
          this.counterConn[5].value = this.connectedDeviceCounter.length; // ALL
          // Getting the connections counter by date range.
          for (let i = 0; i < 5; i++) {
            this.counterConn[i].value = this.connectedDeviceCounter.filter(
              x => {
                let a = Math.floor(Date.now() / 1000);
                let b = Math.floor(Date.parse(x.counted_at) / 1000);
                let diff = a - b;
                return diff <= this.timeArray[i];
              }
            ).length;
          }

          // Getting the total of mobile connections.
          this.mobileConn = this.connectedDeviceCounter.filter(
            x => x.type === "mobile"
          ).length;

          // Getting the total of desktop connections.
          this.desktopConn = this.connectedDeviceCounter.filter(
            x => x.type === "desktop"
          ).length;
        },
        err => console.log(err)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
