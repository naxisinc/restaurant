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
    if (localStorage.getItem("provider")) {
      localStorage.clear();
      this.router.navigate(["home"]);
    } else {
      this.authService.logout().subscribe(
        res => {
          localStorage.clear();
          this.router.navigate(["home"]);
        },
        err => console.log(err)
      );
    }
  }
}
