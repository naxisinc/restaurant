import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatGridListModule,
  MatChipsModule,
  MatAutocompleteModule
} from '@angular/material';

const MODULES = [
  LayoutModule,
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatGridListModule,
  MatChipsModule,
  MatAutocompleteModule
];

@NgModule({
  imports: [MODULES],
  exports: [MODULES]
})
export class MaterialModule {}
