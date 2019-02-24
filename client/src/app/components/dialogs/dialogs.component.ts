import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialogs",
  templateUrl: "./dialogs.component.html",
  styleUrls: ["./dialogs.component.scss"]
})
export class DialogsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Object) {}

  ngOnInit() {}
}
