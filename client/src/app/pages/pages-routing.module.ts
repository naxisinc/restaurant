import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./users/login/login.component";
import { UsersComponent } from "./users/users.component";
import { SizesComponent } from "./sizes/sizes.component";
import { CategoriesComponent } from "./categories/categories.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { PlatesComponent } from "./plates/plates.component";
import { CommentsAdminComponent } from "./comments/admin/comments-admin.component";
import { RecoverPassComponent } from "./users/recover-pass/recover-pass.component";
import { ChangePassComponent } from "./users/change-pass/change-pass.component";
import { TimerComponent } from "./timer/timer.component"; //
import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  { path: "timer", component: TimerComponent }, //
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "admin/sizes", component: SizesComponent, canActivate: [AuthGuard] },
  {
    path: "admin/categories",
    component: CategoriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/ingredients",
    component: IngredientsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/plates",
    component: PlatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/comments",
    component: CommentsAdminComponent,
    canActivate: [AuthGuard]
  },
  { path: "users", component: UsersComponent, canActivate: [AuthGuard] },
  { path: "recoverpass", component: RecoverPassComponent },
  { path: "changepass", component: ChangePassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
