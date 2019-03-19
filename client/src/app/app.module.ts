import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material";
import { LayoutModule } from "./layout/layout.module";
import { PagesModule } from "./pages/pages.module";
import { ComponentsModule } from "./components/components.module";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";

export function tokenGetter(): string | null {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userToken = user ? user.token : null;
  return userToken;
}

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    PagesModule,
    ComponentsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    AppRoutingModule // always the last element in the array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
