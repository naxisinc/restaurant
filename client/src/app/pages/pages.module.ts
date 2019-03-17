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
import { NgxChartsModule } from "@swimlane/ngx-charts";
import {
  SocialLoginModule,
  AuthServiceConfig,
  // GoogleLoginProvider,
  FacebookLoginProvider
  // LinkedinLoginProvider
} from "ng4-social-login";

import { PagesRoutingModule } from "./pages-routing.module";
import { MaterialModule } from "../material";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./users/login/login.component";
import { UsersComponent } from "./users/users.component";
import { MixedComponent } from "./mixed/mixed.component";
import { MixedFormComponent } from "./mixed/mixed-form/mixed-form.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { IngredientsFormComponent } from "./ingredients/ingredients-form/ingredients-form.component";
import { PlatesComponent } from "./plates/plates.component";
import { PlatesFormComponent } from "./plates/plates-form/plates-form.component";
import { CommentsAdminComponent } from "./comments/admin/comments-admin.component";
import { ChangePassComponent } from "./users/change-pass/change-pass.component";
import { RecoverPassComponent } from "./users/recover-pass/recover-pass.component";
import { ComponentsModule } from "../components/components.module";
import { MenuComponent } from "./menu/menu.component";
import { LocationComponent } from "./location/location.component";
import { AboutComponent } from "./about/about.component";
import { FacebookComponent } from "./users/login/facebook/facebook.component";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: "horizontal",
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true
};

const CONFIG = new AuthServiceConfig(
  [
    // {
    //   id: GoogleLoginProvider.PROVIDER_ID,
    //   provider: new GoogleLoginProvider(
    //     "528257019237-cmk5abldl3hgmjkfbe1tg1suqn46pof7.apps.googleusercontent.com"
    //   )
    // },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("289185382020600")
    }
    // {
    //   id: LinkedinLoginProvider.PROVIDER_ID,
    //   provider: new LinkedinLoginProvider("LINKEDIN_CLIENT_ID")
    // }
  ],
  false
);

export function provideConfig() {
  return CONFIG;
}

const COMPONENTS = [
  HomeComponent,
  MenuComponent,
  LocationComponent,
  AboutComponent,
  DashboardComponent,
  LoginComponent,
  FacebookComponent,
  UsersComponent,
  MixedComponent,
  MixedFormComponent,
  IngredientsComponent,
  IngredientsFormComponent,
  PlatesComponent,
  PlatesFormComponent,
  CommentsAdminComponent,
  ChangePassComponent,
  RecoverPassComponent
];

const CudForms = [
  MixedFormComponent,
  IngredientsFormComponent,
  PlatesFormComponent
];

@NgModule({
  declarations: COMPONENTS,
  exports: [CudForms],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    StarRatingModule.forRoot(),
    SwiperModule,
    FlexLayoutModule,
    NgxChartsModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class PagesModule {}
