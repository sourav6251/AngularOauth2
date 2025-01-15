import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Oauth2ConfigService } from './service/oauth2-config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private oauthService: OAuthService, private oauth2configuration: Oauth2ConfigService) {
    oauth2configuration.handleRedirectAfterLogin();

  }
  logout(): void {
    this.oauthService.revokeTokenAndLogout();


    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    console.log("logout");


    // Reset the OAuth service session
    this.oauthService.logOut();
    // Optional: Add your Keycloak logout URL with the correct redirect URI
    const logoutUrl = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/';
    if (!logoutUrl) {
      console.error('Logout URL is missing!');
    }
    window.location.href = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/';

  }
  title = 'oauth2-client';
}
