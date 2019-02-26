import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../material";
import { FooterComponent } from "./footer/footer.component";
import { ChipsComponent } from "./chips/chips.component";
import { SelectComponent } from "./select/select.component";
import { DialogsComponent } from "./dialogs/dialogs.component";
import { LayoutComponent, SessionDialog } from "./layout/layout.component";
import { CudComponent } from "./cud/cud.component";

const COMPONENTS = [
  FooterComponent,
  LayoutComponent,
  SessionDialog,
  ChipsComponent,
  SelectComponent,
  DialogsComponent,
  CudComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: COMPONENTS,
  entryComponents: [DialogsComponent, SessionDialog]
})
export class ComponentsModule {}
