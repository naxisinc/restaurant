import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subject, timer, Subscription } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { MatDialog, MatDialogRef } from "@angular/material";

import { AuthService } from "../../../services/auth.service";
import { SubjectService } from "../../../services/subject.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  isEnoughBig$: Observable<boolean> = this.breakpointObserver
    // .observe("(max-width: 1280px)")
    .observe("(max-width: 1256px)")
    .pipe(map(result => result.matches));

  isCudRoute: boolean = false;
  isItemSelected: boolean;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private subjectService: SubjectService
  ) {
    // Identify the route for hide or show the navbar-end
    this.subjectService.currentRoute.subscribe(route => {
      if (route !== null) {
        if (
          route === "sizes" ||
          route === "categories" ||
          route === "ingredients" ||
          route === "plates"
        ) {
          this.isCudRoute = true;
        } else {
          this.isCudRoute = false;
        }
      }
    });

    // Check if any item was selected for hide or show the navbar-end
    this.subjectService.getItemSelectedFlag.subscribe(flag => {
      this.isItemSelected = flag ? true : false;
    });
  }

  close(reason: string) {
    this.subjectService.setItemSelectedFlag(false);
  }

  onLogoutClick() {
    const provider = JSON.parse(localStorage.getItem("currentUser")).user
      .provider;
    this.authService.logout(provider).subscribe(
      res => {
        this.router.navigate(["home"]);
      },
      err => console.log(err)
    );
  }

  // ============== Timer logout =============
  minutesDisplay = 0;
  secondsDisplay = 0;

  // endTime = 1; // min de inactividad antes de logout
  // preLogoutTime = 30; // seconds (60min = 3600sec) - 3480sec = [2min]
  endTime = 60; // min de inactividad antes de logout
  preLogoutTime = 3480; // seconds (60min = 3600sec) - 3480sec = [2min]

  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  ngOnInit() {
    this.resetTimer();
    this.subjectService.userActionOccured
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
        this.resetTimer();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetTimer(endTime: number = this.endTime) {
    if (this.authService.loggedIn()) {
      const interval = 1000;
      const duration = endTime * 60;
      let dialogRef: MatDialogRef<SessionDialog>;
      this.timerSubscription = timer(0, interval)
        .pipe(take(duration))
        .subscribe(
          value => {
            // console.log(value);
            this.render((duration - +value) * interval);
            if (value === this.preLogoutTime) {
              dialogRef = this.dialog.open(SessionDialog, {
                width: "500px",
                data: {}
              });
              dialogRef.afterClosed().subscribe(action => {
                if (action === "logout") {
                  this.onLogoutClick();
                  this.timerSubscription.unsubscribe();
                }
              });
            }
            // Sharing the counters to SessionDialog
            this.subjectService.changeTime({
              minutes: this.minutesDisplay,
              seconds: this.secondsDisplay
            });
          },
          err => console.log(err),
          () => {
            dialogRef.close();
            this.onLogoutClick();
          }
        );
    }
  }

  /* Timer function for render */
  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? "0" + digit : digit;
  }
}

/* Dialog Component ONLY for session logged */
@Component({
  selector: "session-dialog",
  templateUrl: "session-dialog.html"
})
export class SessionDialog implements OnInit {
  constructor(private subjectService: SubjectService) {}

  minutesDisplay = 0;
  secondsDisplay = 0;
  ngOnInit() {
    this.subjectService.currentTime.subscribe(time => {
      this.minutesDisplay = time.minutes;
      this.secondsDisplay = time.seconds;
    });
  }
}
