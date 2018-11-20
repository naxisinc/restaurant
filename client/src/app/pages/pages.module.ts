import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../material';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './users/login/login.component';
import { UsersComponent } from './users/users.component';
import { SizesComponent } from './sizes/sizes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { PlatesComponent } from './plates/plates.component';
import { CommentsComponent } from './comments/comments.component';
import { ChangePassComponent } from './users/change-pass/change-pass.component';
import { RecoverPassComponent } from './users/recover-pass/recover-pass.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    UsersComponent,
    SizesComponent,
    IngredientsComponent,
    PlatesComponent,
    CommentsComponent,
    ChangePassComponent,
    RecoverPassComponent
  ],
  imports: [CommonModule, PagesRoutingModule, MaterialModule]
})
export class PagesModule {}
