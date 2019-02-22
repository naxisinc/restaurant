import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, timer, Subscription } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"]
})
export class TimerComponent implements OnInit, OnDestroy {
  minutesDisplay = 0;
  secondsDisplay = 0;

  endTime = 1;

  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.resetTimer();
    this.authService.userActionOccured
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
    const interval = 1000; // cada x segundos
    const duration = endTime * 60;
    this.timerSubscription = timer(1, interval)
      .pipe(take(duration))
      .subscribe(
        value => this.render((duration - +value) * interval),
        err => {},
        () => {
          this.authService.logOutUser();
        }
      );
  }

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
