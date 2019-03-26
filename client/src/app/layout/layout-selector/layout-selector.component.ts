import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver
} from "@angular/core";
import { LayoutItem } from "./layout-item";
import { LyDirective } from "./layout.directive";

@Component({
  selector: "app-layout-selector",
  template: `
    <app-header></app-header>
    <ng-template layout-host></ng-template>
    <app-footer></app-footer>
  `,
  styleUrls: ["./layout-selector.component.scss"]
})
export class LayoutSelectorComponent implements OnInit {
  @Input() layout: LayoutItem[];
  currentAdIndex = -1;
  @ViewChild(LyDirective) adHost: LyDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadComponent();
    this.getAds();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent() {
    this.currentAdIndex = (this.currentAdIndex + 1) % this.layout.length;
    let adItem = this.layout[this.currentAdIndex];

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      adItem.component
    );

    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    // (<AdComponent>componentRef.instance).data = adItem.data;
  }

  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}
