import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, filter, takeUntil, take } from "rxjs/operators";
import { Router, NavigationStart } from "@angular/router";
import { Subject, timer, Subscription } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material";

import { AuthService } from "../../../services/auth.service";
import { SubjectService } from "../../../services/subject.service";
import { PlatesFormComponent } from "../../../pages/plates/plates-form/plates-form.component";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  isEnoughBig$: Observable<boolean> = this.breakpointObserver
    // .observe("(max-width: 1280px)")
    .observe("(max-width: 1256px)")
    .pipe(map(result => result.matches));

  isCudRoute: boolean = false;
  isItemSelected: boolean;

  /* Dynamic Height para evitar scrollbar en los menu del layout */
  minHeight: number;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private subjectService: SubjectService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // Guardo la ruta en un Observer pq lo voy a necesitar a
    // la hora de gestionar los mixesComponents (sizes & categories)
    // y de fijar los min-height en el layout container
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        let route = event.url.split("/").pop();
        this.subjectService.changeRoute(route);
      });

    // Identify the route for hide or show the navbar-end
    this.subjectService.currentRoute.subscribe(route => {
      // console.log(route); //
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

    // Timer staff
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

  /* Calcular alturas de los sidenav del layout
  para evitar los scrollbar en los menus */
  @ViewChild("drawer") left_nav;
  @ViewChild(PlatesFormComponent) endMenu;
  ngAfterViewInit() {
    this.calcNavContainerHeight();
  }

  ngAfterViewChecked() {
    this.minHeight = this.minHeightTemp;
  }

  minHeightTemp: number;
  calcNavContainerHeight() {
    /* ============== Body Height ============ */
    let footerHeight = document.querySelector(".footer").clientHeight;
    let body = document.documentElement.clientHeight;
    let bodyHeight = body - footerHeight;
    /* ======================================= */
    /* ============== Left Height ============ */
    let leftTopHeight = this.left_nav._elementRef.nativeElement.lastElementChild
      .lastElementChild.offsetTop;
    let leftCenterHeight = this.left_nav._elementRef.nativeElement
      .lastElementChild.lastElementChild.offsetHeight;
    let leftHeight = leftTopHeight + leftCenterHeight;
    /* ======================================= */
    /* ============== Right Height =========== */
    let rightHeight;
    this.subjectService.getCUDHeight.subscribe(res => {
      rightHeight = res;
      /* Setting the min-height value */
      if (bodyHeight > leftHeight && bodyHeight > rightHeight) {
        this.minHeightTemp = bodyHeight;
      } else {
        this.minHeightTemp =
          leftHeight > rightHeight ? leftHeight : rightHeight;
      }
      console.log(`body: ${bodyHeight}`);
      console.log(`left: ${leftHeight}`);
      console.log(`right: ${rightHeight}`);
      console.log(this.minHeightTemp);
    });
    /* ======================================= */
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
