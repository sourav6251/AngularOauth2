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
    const idToken = localStorage.getItem('id_token');
    console.log(idToken);
    

    // Reset the OAuth service session
    this.oauthService.logOut();

    // const idToken = this.oauthService.getIdToken(); // Get the id_token from the OAuth service (Keycloak or another provider)
    const postLogoutRedirectUri = 'http://localhost:4200/'; // Define where to redirect after logout

    if (idToken) {
      // Build the logout URL with the id_token_hint
      const logoutUrl = `http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}&id_token_hint=${encodeURIComponent(idToken)}`;

      // Redirect the user to the logout URL
      window.location.href = logoutUrl;
    } else {
      console.error('ID token not found. Unable to log out.');
    }
    // Optional: Add your Keycloak logout URL with the correct redirect URI
    // const logoutUrl = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/';
    // if (!logoutUrl) {
    //   console.error('Logout URL is missing!');
    // }
    // window.location.href = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/';
    // setTimeout(() => {
    //   window.location.href = 'http://localhost:4200/'; // Redirect to desired page
    // }, 1000);
    this.oauthService.revokeTokenAndLogout();


    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    console.log("logout");


  }

  title = 'oauth2-client';
}
