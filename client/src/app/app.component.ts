import { Component, HostListener } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { VisitorsCounterService } from "./services/visitorscounter.service";

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
    private visitorsCounterService: VisitorsCounterService
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

  deviceCounter: any;
  deviceType() {
    this.visitorsCounterService.getRoutesCounter().subscribe(
      succ => {
        this.deviceCounter = succ;
        this.deviceCounter = this.deviceCounter.filter(
          x => x.counterId === this.device
        )[0];

        // Increase the visitor counter for menu
        this.visitorsCounterService.patchRoute(this.deviceCounter).subscribe(
          succ => {
            // console.log('increased succesfully');
          },
          err => console.log(err)
        );
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
