import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [CommonModule, MaterialModule],
  exports: [NavbarComponent, FooterComponent]
})
export class ComponentsModule {}
