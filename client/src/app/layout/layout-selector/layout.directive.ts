import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[layout-host]"
})
// Ly = Loyout tuve q usarlo asi pq flex tiene un derective con ese nombre
export class LyDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
