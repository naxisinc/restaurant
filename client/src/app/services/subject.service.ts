import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";

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

  // ============= Mixed ===========
  // Refresh the DataSource
  private elementToRefresh = new BehaviorSubject(null);
  elementRefreshed = this.elementToRefresh.asObservable();
  elementDataSourceRefresh() {
    this.elementToRefresh.next("");
  }
  private elementSelect = new BehaviorSubject(null);
  elementSelected = this.elementSelect.asObservable();
  setElementSelect(element: object) {
    this.elementSelect.next(element);
  }

  // ============= Ingredients ===========
  // Refresh the DataSource
  private ingredientRefresh = new BehaviorSubject(null);
  ingredientRefreshed = this.ingredientRefresh.asObservable();
  ingredientDataSourceRefresh() {
    this.ingredientRefresh.next("");
  }
  private ingredientSelect = new BehaviorSubject(null);
  ingredientSelected = this.ingredientSelect.asObservable();
  setIngredientSelect(ingredient: object) {
    this.ingredientSelect.next(ingredient);
  }

  // ============= Dishes ===========
  // Refresh the DataSource
  private dishRefresh = new BehaviorSubject(null);
  dishRefreshed = this.dishRefresh.asObservable();
  dishDataSourceRefresh() {
    this.dishRefresh.next("");
  }
  private dishSelect = new BehaviorSubject(null);
  dishSelected = this.dishSelect.asObservable();
  setDishSelect(ingredient: object) {
    this.dishSelect.next(ingredient);
  }

  // =========== User LogIn ==========
  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  currentUser = this.currentUserSubject.asObservable();
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  setCurrentUser(user: object) {
    this.currentUserSubject.next(user);
  }

  // ======== User Action Listener =======
  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> {
    return this._userActionOccured.asObservable();
  }
  notifyUserAction() {
    this._userActionOccured.next();
  }

  // // Set the min-height to mat-navbar-container
  // private height = new BehaviorSubject<number>(0);
  // getMinHeight = this.height.asObservable();
  // setMinHeight(min_height: number) {
  //   this.height.next(min_height);
  // }
  // Set the min-height to mat-navbar-container
  private height = new BehaviorSubject<number>(0);
  getCUDHeight = this.height.asObservable();
  setCUDHeight(height: number) {
    this.height.next(height);
  }
}
