import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Oauth2ConfigService {
  constructor(private http: HttpClient, private oauthService: OAuthService,private router:Router) { }

  // Handle redirect after login
  handleRedirectAfterLogin(): void {
    const urlParams = new URLSearchParams(window.location.search);


    const code = urlParams.get('code');

    if (code) {
      // Exchange authorization code for tokens
      this.exchangeAuthorizationCodeForTokens(code).subscribe(
        (response) => {
          // Optionally store refresh token
          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }
        },
        (error) => {
          console.error('Error exchanging authorization code:', error);
        }
      );
    } else {
    }
  }


  // OAuth configuration for Keycloak
  configKeycloakOAuth(): void {

    const keycloakAuthConfig: AuthConfig = {
      issuer: 'http://0.0.0.0:8080/realms/Oauth',
      redirectUri: 'http://localhost:4200/body', // Update as per your app's URL
      clientId: 'sourav',
      tokenEndpoint: 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token',
      scope: 'openid profile email', // Ensure "openid" is included
      responseType: 'code',
      requireHttps: false,
      dummyClientSecret: '9LYozjDb59iHIbx4TFhbF6CLmfwiFLS5',
      disablePKCE: true,
      postLogoutRedirectUri: 'http://localhost:4200/logout', // Redirect URI after logout
    };

    this.oauthService.configure(keycloakAuthConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        // Retrieve and log tokens
        const accessToken = this.oauthService.getAccessToken();
        const idToken = this.oauthService.getIdToken();
        // Store tokens in storage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);
      } else {
        this.oauthService.initCodeFlow();
      }
    }).catch((error) => {
      localStorage.setItem('refresh','refresh');
      console.error('Error during OAuth login:', error);
    });
  }

  // Exchange Authorization Code for Tokens
  exchangeAuthorizationCodeForTokens(code: string): Observable<any> {

    const tokenEndpoint = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token';
    const redirectUri = 'http://localhost:4200/body';
    const clientId = 'sourav';
    const clientSecret = '9LYozjDb59iHIbx4TFhbF6CLmfwiFLS5';

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', redirectUri)
      .set('client_id', clientId)
      .set('client_secret', clientSecret);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(tokenEndpoint, body, { headers }).pipe(
      tap((response: any) => {

        // Extract and store tokens
        const accessToken = response.access_token;
        const idToken = response.id_token;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);

      })
    );

  }


  // Make an API request using the access token
  makeApiRequest(): Observable<any> {
    const accessToken = this.oauthService.getAccessToken();

    if (accessToken) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken);
      return this.http.get('http://localhost:8080/protected-resource', { headers });
    } else {
      throw new Error('Access token is missing');
    }
  }

  // Refresh the access token using refresh token
  refreshAccessToken(): void {
    this.oauthService.refreshToken().then(() => {
      const newAccessToken = this.oauthService.getAccessToken();
      localStorage.setItem('access_token', newAccessToken);
    }).catch((error) => {
      console.error('Error refreshing access token:', error);
    });
  }
}
