import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}

  private time = new BehaviorSubject(null);
  currentTime = this.time.asObservable();
  changeTime(time: object) {
    this.time.next(time);
  }

  private route = new BehaviorSubject(null);
  currentRoute = this.route.asObservable();
  changeRoute(route: string) {
    this.route.next(route);
  }
}
