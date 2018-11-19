import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../material';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [HomeComponent, LoginComponent],
  imports: [CommonModule, PagesRoutingModule, MaterialModule]
})
export class PagesModule {}
