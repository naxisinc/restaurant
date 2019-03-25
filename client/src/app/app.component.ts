import { Component, HostListener } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { DeviceCounterService } from "./services/devicecounter.service";
import { SubjectService } from "./services/subject.service";

@Component({
  selector: "app-root",
  template: `
    <!--section class="mat-typography"></session-->

    <app-header></app-header>

    <app-layout *ngIf="view === 'admin'">
      <router-outlet></router-outlet>
    </app-layout>

    <!--div *ngIf="view === 'user'"-->
    <router-outlet></router-outlet>
    <!--/div-->

    <app-footer></app-footer>
  `,
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  device: string;
  view: string = "user";

  constructor(
    private authService: AuthService,
    private subjectService: SubjectService,
    private deviceCounterService: DeviceCounterService
  ) {
    if (this.authService.loggedIn()) {
      // this.view = this.subjectService.currentUserValue.user.role;
      // console.log(this.view);
      this.subjectService.currentUser.subscribe(res => {
        console.log(res);
        if (res) {
          this.view = res.user.role;
          console.log(this.view);
        } else {
          this.view = "user";
        }
      });
    }

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
      this.subjectService.notifyUserAction();
    }
  }
}
