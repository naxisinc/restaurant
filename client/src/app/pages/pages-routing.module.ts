import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './users/login/login.component';
import { UsersComponent } from './users/users.component';
import { SizesComponent } from './sizes/sizes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { PlatesComponent } from './plates/plates.component';
import { CommentsComponent } from './comments/comments.component';
import { RecoverPassComponent } from './users/recover-pass/recover-pass.component';
import { ChangePassComponent } from './users/change-pass/change-pass.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sizes', component: SizesComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'plates', component: PlatesComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'recoverpass', component: RecoverPassComponent },
  { path: 'changepass', component: ChangePassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
