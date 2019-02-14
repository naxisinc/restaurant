import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../material";
import { FooterComponent } from "./footer/footer.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { ChipsComponent } from "./chips/chips.component";
import { SelectComponent } from "./select/select.component";
import { DialogsComponent } from "./dialogs/dialogs.component";

const COMPONENTS = [
  FooterComponent,
  MainNavComponent,
  ChipsComponent,
  SelectComponent,
  DialogsComponent
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [COMPONENTS],
  entryComponents: [DialogsComponent] // para importar el componente dentro de otro component
})
export class ComponentsModule {}
