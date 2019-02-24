import { Component, HostListener } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  template: `
    <app-layout
      ><section class="mat-typography"><router-outlet></router-outlet></section
    ></app-layout>
  `,
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  @HostListener("document:keyup", ["$event"])
  @HostListener("document:click", ["$event"])
  @HostListener("document:wheel", ["$event"])
  resetTimer() {
    if (this.authService.loggedIn()) {
      this.authService.notifyUserAction();
    }
  }
}
