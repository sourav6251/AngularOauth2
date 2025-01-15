import { Component } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Oauth2ConfigService } from '../service/oauth2-config.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private oauth2configuration: Oauth2ConfigService, private oauthService: OAuthService) {
    // console.log("Access token:  "+localStorage.getItem('access_token'));
    // console.log("Access token:  "+sessionStorage.getItem('access_token'));

    // console.log("get id token  "+this.oauthService.getIdToken());
    // console.log("get id token  "+this.oauthService.getAccessToken());
    // console.log("get hasValidAccessToken  "+this.oauthService.hasValidAccessToken());
    console.log("call constrouctor");

  }
  googlelogin(): void {
    console.log("Google login initiated");

    this.oauth2configuration.configKeycloakOAuth();
  }

  facebooklogin(): void {

    console.log("Facebook login initiated");
  }

  gitlogin(): void {
    console.log("GitHub login initiated");


  }
}
// gitlogin(): void {
//   console.log("GitHub login initiated");

//   this.oauthService.configure({
//     issuer: 'https://github.com/login/oauth',
//     redirectUri: this.configService.gitOAuthConfig.redirectUri,
//     clientId: this.configService.gitOAuthConfig.clientId,
//     scope: this.configService.gitOAuthConfig.scope,
//     responseType: 'code',
//     // pkceMethod: this.configService.gitOAuthConfig.pkceMethod,
//     requireHttps: false,

//   });

//   this.oauthService.loadDiscoveryDocument().then(() => {
//     this.oauthService.initCodeFlow();  // Initiating code flow for GitHub login
//   });
// }

