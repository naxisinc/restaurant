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

  // ============= Categories ===========
  // Refresh the DataSource
  private categoryRefresh = new BehaviorSubject(null);
  categoryRefreshed = this.categoryRefresh.asObservable();
  categoryDataSourceRefresh() {
    this.categoryRefresh.next("");
  }
  private categorySelect = new BehaviorSubject(null);
  categorySelected = this.categorySelect.asObservable();
  setCategorySelect(category: object) {
    this.categorySelect.next(category);
  }

  // ============= Mixed ===========
  // Table for renderRows() from any route
  private tableToRefresh = new BehaviorSubject(null);
  getTable = this.tableToRefresh.asObservable();
  pushTable(table: any) {
    this.tableToRefresh.next(table);
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
}
