import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Oauth2ConfigService } from '../service/oauth2-config.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,FormsModule,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  constructor(private oauthService: OAuthService, private oauth2configuration: Oauth2ConfigService) {
  // Check if the token exists on initialization
  const token = localStorage.getItem('id_token');
  this.isLoggedIn = !!token; // Convert token existence to a boolean

   }



  logout(): void {
    const idToken = localStorage.getItem('id_token');
    console.log(idToken);


    // Remove session from OAuth service
    this.oauthService.logOut();

    const postLogoutRedirectUri = 'http://localhost:4200/logout'; // Define where to redirect after logout

    if (idToken) {
      // Build the logout URL with the id_token_hint
      const logoutUrl = `http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}&id_token_hint=${encodeURIComponent(idToken)}`;

      // Redirect the user to the logout URL
      window.location.href = logoutUrl;
    } else {
      console.error('ID token not found. Unable to log out.');
    }

    this.oauthService.revokeTokenAndLogout();

    //remove tokem from LocalStorage and SessionStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }
}
