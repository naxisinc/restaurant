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

  // Set the Item Selected Flag
  private flag = new BehaviorSubject<boolean>(false);
  getItemSelectedFlag = this.flag.asObservable();
  setItemSelectedFlag(state: boolean) {
    this.flag.next(state);
  }

  // ============= Size ===========
  // Refresh the DataSource
  private sizeRefresh = new BehaviorSubject(null);
  sizeRefreshed = this.sizeRefresh.asObservable();
  sizeDataSourceRefresh() {
    this.sizeRefresh.next("");
  }

  private sizeSelect = new BehaviorSubject(null);
  sizeSelected = this.sizeSelect.asObservable();
  setSizeSelect(size: object) {
    this.sizeSelect.next(size);
  }
}
