import { Component, OnInit, Input } from "@angular/core";
import { Interface } from "../interface";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit, Interface {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
