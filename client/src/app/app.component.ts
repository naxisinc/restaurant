import { Component, HostListener } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { DeviceCounterService } from "./services/devicecounter.service";

@Component({
  selector: "app-root",
  template: `
    <app-layout>
      <section class="mat-typography">
        <router-outlet></router-outlet>
      </section>
    </app-layout>
  `,
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  device: string;
  constructor(
    private authService: AuthService,
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

    // Counting the device type
    this.deviceType();
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
      this.authService.notifyUserAction();
    }
  }
}
