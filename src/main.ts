import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LoginComponent } from './app/login/login.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BodyComponent } from './app/body/body.component';
import { SecureComponent } from './app/secure/secure.component';
import { LogoutComponent } from './app/logout/logout.component';
import { NavbarComponent } from './app/navbar/navbar.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([{
      path: 'login',
      component:LoginComponent,
      pathMatch: 'full'
  },
  {
    path: 'body',
    component:BodyComponent,
    pathMatch: 'full'
  },
  {
    path:'secure',
    component:SecureComponent,
    pathMatch: 'full'

  },
  {
    path:'logout',
    component:LogoutComponent,
    pathMatch:'full'
  },
  {
    path:'nav',
    component:NavbarComponent,
    pathMatch:'full'
  }
]), // Add your routes here
    importProvidersFrom(OAuthModule.forRoot()), // Correctly import the OAuthModule
    provideHttpClient()
  ],
}).catch((err) => console.error(err));