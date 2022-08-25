import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListGameComponent } from './pages/list-game/list-game.component';
import { LoginComponent } from './pages/login/login.component';
import { NewGameComponent } from './pages/new-game/new-game.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'newgame', component: NewGameComponent },
  { path: 'gamelist', component: ListGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
