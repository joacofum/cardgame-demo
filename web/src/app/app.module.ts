import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NewGameComponent } from './pages/new-game/new-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import {ApiService} from './shared/services/api.service';
import { ListGameComponent } from './pages/list-game/list-game.component';
import { BoardComponent } from './pages/board/board.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './componets/header/header.component'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { RegisterComponent } from './pages/register/register.component';
@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    ListGameComponent,
    BoardComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideAuth(()=> getAuth())
    
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
