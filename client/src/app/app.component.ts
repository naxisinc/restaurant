import { Component, HostListener, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { DeviceCounterService } from "./services/devicecounter.service";
import { SubjectService } from "./services/subject.service";
import { LayoutItem } from "./layout/layout-selector/layout-item";
import { LayoutService } from "./layout/layout-selector/layout.service";

@Component({
  selector: "app-root",
  template: `
    <!--section class="mat-typography"></session-->
    <app-layout-selector [layout]="layout"></app-layout-selector>
  `,
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  device: string;
  layout: LayoutItem[];

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private subjectService: SubjectService,
    private deviceCounterService: DeviceCounterService
  ) {
    let ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    )
      this.device = "mobile";
    else this.device = "desktop";
  }

  ngOnInit() {
    // Counting the device type
    this.deviceType();

    this.layout = this.layoutService.getLayouts();
    // console.log(this.layout);
  }

  deviceType() {
    let obj = { type: this.device };
    this.deviceCounterService.postDevice(obj).subscribe(
      succ => {
        // console.log(succ);
      },
      err => console.log(err)
    );
  }

  @HostListener("document:keyup", ["$event"])
  @HostListener("document:click", ["$event"])
  @HostListener("document:wheel", ["$event"])
  resetTimer() {
    if (this.authService.loggedIn()) {
      this.subjectService.notifyUserAction();
    }
  }
}
