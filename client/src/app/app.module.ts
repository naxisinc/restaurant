import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    PagesModule,
    ComponentsModule,
    AppRoutingModule // always the last element in the array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
