import { Component } from "@angular/core";

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
  title = "client";
}
