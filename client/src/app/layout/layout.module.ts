import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { LayoutComponent, SessionDialog } from "./layout/layout.component";
import { CudComponent } from "./cud/cud.component";
import { PagesModule } from "../pages/pages.module";
import { ComponentsModule } from "../components/components.module";
import { MaterialModule } from "../material";
import { LayoutSelectorComponent } from "./layout-selector/layout-selector.component";
import { UserLayoutComponent } from "./layout-selector/user-layout/user-layout.component";
import { AdminLayoutComponent } from "./layout-selector/admin-layout/admin-layout.component";
import { LayoutService } from "./layout-selector/layout.service";
import { LyDirective } from "./layout-selector/layout.directive";

const COMPONENTS = [
  LayoutComponent,
  SessionDialog,
  CudComponent,
  LayoutSelectorComponent,
  AdminLayoutComponent,
  UserLayoutComponent,
  LyDirective
];

@NgModule({
  declarations: COMPONENTS,
  exports: [LayoutComponent, LayoutSelectorComponent],
  providers: [LayoutService],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    PagesModule,
    ComponentsModule
  ],
  entryComponents: [SessionDialog, AdminLayoutComponent, UserLayoutComponent]
})
export class LayoutModule {}
