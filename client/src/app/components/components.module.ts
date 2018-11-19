import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material';
import { FooterComponent } from './footer/footer.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [FooterComponent, MainNavComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [COMPONENTS]
})
export class ComponentsModule {}
