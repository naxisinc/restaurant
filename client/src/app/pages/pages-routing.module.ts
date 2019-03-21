import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./users/login/login.component";
import { SignupComponent } from "./users/signup/signup.component";
import { UsersComponent } from "./users/users.component";
import { MixedComponent } from "./mixed/mixed.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { PlatesComponent } from "./plates/plates.component";
import { CommentsAdminComponent } from "./comments/admin/comments-admin.component";
import { MenuComponent } from "./menu/menu.component";
import { LocationComponent } from "./location/location.component";
import { AboutComponent } from "./about/about.component";
import { RecoverPassComponent } from "./users/recover-pass/recover-pass.component";
import { ChangePassComponent } from "./users/change-pass/change-pass.component";
import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "menu", component: MenuComponent },
  { path: "location", component: LocationComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recoverpass", component: RecoverPassComponent },
  { path: "changepass", component: ChangePassComponent },
  {
    path: "admin/dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "admin/sizes",
    component: MixedComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "admin/categories",
    component: MixedComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "admin/ingredients",
    component: IngredientsComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "admin/plates",
    component: PlatesComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "admin/comments",
    component: CommentsAdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
