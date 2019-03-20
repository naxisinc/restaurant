import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogoutClick() {
    const pro = JSON.parse(localStorage.getItem("currentUser")).provider;
    this.authService.logout(pro).subscribe(
      res => {
        this.router.navigate(["home"]);
      },
      err => console.log(err)
    );
  }
}
