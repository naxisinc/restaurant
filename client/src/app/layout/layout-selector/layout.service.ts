import { Injectable } from "@angular/core";

import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { UserLayoutComponent } from "./user-layout/user-layout.component";
import { LayoutItem } from "./layout-item";

@Injectable()
export class LayoutService {
  getLayouts() {
    // Aqui listo los distintos layout q quiero en el app
    // en la posicion 0 tendre el layout para el role admin
    // y en 1 al de los users.
    return [
      new LayoutItem(AdminLayoutComponent),
      new LayoutItem(UserLayoutComponent)
    ];
  }
}
