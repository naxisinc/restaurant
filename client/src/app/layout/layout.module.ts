import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { LayoutComponent, SessionDialog } from "./layout/layout.component";
import { CudComponent } from "./cud/cud.component";
import { PagesModule } from "../pages/pages.module";
import { ComponentsModule } from "../components/components.module";
import { MaterialModule } from "../material";

const COMPONENTS = [LayoutComponent, SessionDialog, CudComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    PagesModule,
    ComponentsModule
  ]
})
export class LayoutModule {}
