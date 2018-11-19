import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

const COMPONENTS = [
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatToolbarModule
];

@NgModule({
  imports: [COMPONENTS],
  exports: [COMPONENTS]
})
export class MaterialModule {}
