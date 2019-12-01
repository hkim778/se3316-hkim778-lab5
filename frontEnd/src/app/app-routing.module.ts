import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AdminComponent } from './admin/admin.component';
 



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'new-account',component:NewAccountComponent},
  { path: 'authenticated', component: AuthenticatedComponent},
  { path: 'admin', component: AdminComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
