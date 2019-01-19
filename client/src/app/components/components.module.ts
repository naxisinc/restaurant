import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material';
import { FooterComponent } from './footer/footer.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { ChipsComponent } from './chips/chips.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

const COMPONENTS = [
  FooterComponent,
  MainNavComponent,
  ChipsComponent,
  AutocompleteComponent
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [COMPONENTS]
})
export class ComponentsModule {}
