import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { SongsComponent} from './songs/songs.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'new-account',component:NewAccountComponent},
  { path: 'songs', component: SongsComponent},
  { path: 'authenticated', component: AuthenticatedComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
