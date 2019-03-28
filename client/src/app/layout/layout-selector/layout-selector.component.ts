import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver
} from "@angular/core";
import { LayoutItem } from "./layout-item";
import { LyDirective } from "./layout.directive";
import { SubjectService } from "src/app/services/subject.service";

@Component({
  selector: "app-layout-selector",
  template: `
    <app-header></app-header>
    <ng-template layout-host></ng-template>
    <app-footer></app-footer>
  `
})
export class LayoutSelectorComponent implements OnInit {
  @Input() layout: LayoutItem[];
  currentLyIndex = 1;
  @ViewChild(LyDirective) adHost: LyDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.subjectService.currentUser.subscribe(
      res => {
        // console.log(res);
        if (res && res.user.role === "admin") {
          this.currentLyIndex = 0;
        } else {
          this.currentLyIndex = 1;
        }
        let adItem = this.layout[this.currentLyIndex];

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          adItem.component
        );

        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
      },
      err => console.log(err)
    );
  }
}
