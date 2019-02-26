import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StarRatingModule } from "angular-star-rating";
import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface
} from "ngx-swiper-wrapper";
import { FlexLayoutModule } from "@angular/flex-layout";

import { PagesRoutingModule } from "./pages-routing.module";
import { MaterialModule } from "../material";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./users/login/login.component";
import { UsersComponent } from "./users/users.component";
import { SizesComponent } from "./sizes/sizes.component";
import { CategoriesComponent } from "./categories/categories.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { PlatesComponent } from "./plates/plates.component";
import { CommentsAdminComponent } from "./comments/admin/comments-admin.component";
import { ChangePassComponent } from "./users/change-pass/change-pass.component";
import { RecoverPassComponent } from "./users/recover-pass/recover-pass.component";
import { ComponentsModule } from "../components/components.module";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: "horizontal",
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true
};

const COMPONENTS = [
  HomeComponent,
  LoginComponent,
  UsersComponent,
  SizesComponent,
  CategoriesComponent,
  IngredientsComponent,
  PlatesComponent,
  CommentsAdminComponent,
  ChangePassComponent,
  RecoverPassComponent
];

@NgModule({
  declarations: COMPONENTS,
  exports: [SizesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    StarRatingModule.forRoot(),
    SwiperModule,
    FlexLayoutModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class PagesModule {}
