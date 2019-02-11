import { Component, OnInit } from "@angular/core";
import { CommentsService } from "../../services/comments.service";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
  message: string;

  constructor(private data: CommentsService) {}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => (this.message = message));
  }

  newMessage() {
    this.data.changeMessage("Hello from Sibling");
  }
}
