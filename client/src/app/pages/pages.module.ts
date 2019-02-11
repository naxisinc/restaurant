import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StarRatingModule } from "angular-star-rating";

import { PagesRoutingModule } from "./pages-routing.module";
import { MaterialModule } from "../material";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./users/login/login.component";
import { UsersComponent } from "./users/users.component";
import { SizesComponent } from "./sizes/sizes.component";
import { CategoriesComponent } from "./categories/categories.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { PlatesComponent } from "./plates/plates.component";
import { CommentsComponent } from "./comments/comments.component";
import { ChangePassComponent } from "./users/change-pass/change-pass.component";
import { RecoverPassComponent } from "./users/recover-pass/recover-pass.component";
import { ComponentsModule } from "../components/components.module";
import { ParentComponent } from './parent/parent.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    UsersComponent,
    SizesComponent,
    CategoriesComponent,
    IngredientsComponent,
    PlatesComponent,
    CommentsComponent,
    ChangePassComponent,
    RecoverPassComponent,
    ParentComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    StarRatingModule.forRoot()
  ]
})
export class PagesModule {}
