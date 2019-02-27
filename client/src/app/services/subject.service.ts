import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}

  // Sincroniza el time counter del toolbal
  // con el q aparece en el dialog del logout
  private time = new BehaviorSubject(null);
  currentTime = this.time.asObservable();
  changeTime(time: object) {
    this.time.next(time);
  }

  // Get the current route para saber donde
  // estoy en cada momento y que form mostrar
  private route = new BehaviorSubject(null);
  currentRoute = this.route.asObservable();
  changeRoute(route: string) {
    this.route.next(route);
  }

  // Refresh the DataSource
  private sizeRefresh = new BehaviorSubject(null);
  refresh = this.sizeRefresh.asObservable();
  changeRoute(route: string) {
    this.sizeRefresh.next(sizeRefresh);
  }
}
