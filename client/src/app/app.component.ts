import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <section class="mat-typography">
      <app-main-nav><router-outlet></router-outlet></app-main-nav>
    </section>
  `,
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "client";
}
