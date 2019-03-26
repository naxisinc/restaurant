import { Component, OnInit, Input } from "@angular/core";
import { Interface } from "../interface";

@Component({
  selector: "app-user-layout",
  templateUrl: "./user-layout.component.html",
  styleUrls: ["./user-layout.component.scss"]
})
export class UserLayoutComponent implements OnInit, Interface {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
