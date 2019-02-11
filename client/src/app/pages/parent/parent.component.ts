import { Component, OnInit } from "@angular/core";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.scss"]
})
export class ParentComponent implements OnInit {
  message: string;

  constructor(private data: CommentsService) {}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => (this.message = message));
  }
}
