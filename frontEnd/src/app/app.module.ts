import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import{ HttpClientModule } from '@angular/common/http';
import{ FormsModule } from '@angular/forms';
import { HidePasswordDirective } from './hide-password.directive';
import { NewAccountComponent } from './new-account/new-account.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AdminComponent } from './admin/admin.component';
import { PolicyComponent } from './policy/policy.component';
import { ClaimComponent } from './claim/claim.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HidePasswordDirective,
    NewAccountComponent,
    AuthenticatedComponent,
    AdminComponent,
    PolicyComponent,
    ClaimComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
