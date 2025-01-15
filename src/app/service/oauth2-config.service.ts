import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Oauth2ConfigService {
  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  // OAuth configuration for Keycloak
  configKeycloakOAuth(): void {
    console.log('Calling Keycloak OAuth');

    const keycloakAuthConfig: AuthConfig = {
      issuer: 'http://0.0.0.0:8080/realms/Oauth',
      redirectUri: 'http://localhost:4200/', // Update as per your app's URL
      clientId: 'sourav',
      tokenEndpoint: 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token',
      scope: 'openid profile email', // Ensure "openid" is included
      responseType: 'code',
      requireHttps: false,
      dummyClientSecret: '9LYozjDb59iHIbx4TFhbF6CLmfwiFLS5',
      disablePKCE: true,
      postLogoutRedirectUri: 'http://localhost:4200/', // Redirect URI after logout
    };

    this.oauthService.configure(keycloakAuthConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        // Retrieve and log tokens
        const accessToken = this.oauthService.getAccessToken();
        const idToken = this.oauthService.getIdToken();

        console.log('Access Token:', accessToken);
        console.log('ID Token:', idToken);

        // Store tokens in storage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);
      } else {
        // Start OAuth flow
        console.log('No valid tokens found. Starting login flow.');
        this.oauthService.initCodeFlow();
      }
    }).catch((error) => {
      console.error('Error during OAuth login:', error);
    });
  }

  // Exchange Authorization Code for Tokens
  exchangeAuthorizationCodeForTokens(code: string): Observable<any> {
    console.log('Calling exchangeAuthorizationCodeForTokens');

    const tokenEndpoint = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token';
    const redirectUri = 'http://localhost:4200/';
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
        console.log('Token Response:', response);

        // Extract and store tokens
        const accessToken = response.access_token;
        const idToken = response.id_token;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);

        console.log('Access Token:', accessToken);
        console.log('ID Token:', idToken);
      })
    );
  }

  // Handle redirect after login
  handleRedirectAfterLogin(): void {
    console.log('Calling handleRedirectAfterLogin');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange authorization code for tokens
      this.exchangeAuthorizationCodeForTokens(code).subscribe(
        (response) => {
          console.log('Tokens retrieved successfully!');
          console.log('Access Token:', response.access_token);
          console.log('ID Token:', response.id_token);

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
      console.log('No authorization code found in URL');
    }
  }

  // Make an API request using the access token
  makeApiRequest(): Observable<any> {
    console.log('Calling makeApiRequest');
    const accessToken = this.oauthService.getAccessToken();

    if (accessToken) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken);
      return this.http.get('http://localhost:8080/protected-resource', { headers });
    } else {
      console.log('Access token is missing.');
      throw new Error('Access token is missing');
    }
  }

  // Refresh the access token using refresh token
  refreshAccessToken(): void {
    console.log('Calling refreshAccessToken');
    this.oauthService.refreshToken().then(() => {
      const newAccessToken = this.oauthService.getAccessToken();
      console.log('New Access Token:', newAccessToken);
      localStorage.setItem('access_token', newAccessToken);
    }).catch((error) => {
      console.error('Error refreshing access token:', error);
    });
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class Oauth2ConfigService {
  
//   constructor(private http: HttpClient, private oauthService: OAuthService) { }

//   // OAuth configuration for Keycloak
//   configKeycloakOAuth(): void {
//     console.log("Calling Keycloak OAuth");
  
//     const keycloakAuthConfig: AuthConfig = {
//       issuer: 'http://0.0.0.0:8080/realms/Oauth',
//       redirectUri: 'http://localhost:4200/', // Same as your OAuth redirect URI
//       clientId: 'sourav',
//       tokenEndpoint: 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token',
//       scope: 'openid profile email',
//       responseType: 'code',
//       requireHttps: false,
//       dummyClientSecret: '9LYozjDb59iHIbx4TFhbF6CLmfwiFLS5',
//       disablePKCE:true,
//       postLogoutRedirectUri: 'http://localhost:4200/', // Redirect URI after logout
//     };
  
//     this.oauthService.configure(keycloakAuthConfig);
//     this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
//       if (this.oauthService.hasValidAccessToken()) {
//         // Access token is already available, no need to request again
//         const accessToken = this.oauthService.getAccessToken();
//         console.log("Access token retrieved: ", accessToken);
//         localStorage.setItem('access_token', accessToken);
//         sessionStorage.setItem('access_token', accessToken);
//       } else {
//         // No valid token, initiate OAuth flow
//         console.log("No valid access token found.");
//         this.oauthService.initCodeFlow(); // Redirects to OAuth provider to get authorization code
//       }
//     }).catch((error) => {
//       console.error('Error during OAuth login:', error);
//     });
//   }

//   // Exchange Authorization Code for Tokens
//   exchangeAuthorizationCodeForTokens(code: string): Observable<any> {
//     console.log("Calling exchangeAuthorizationCodeForTokens");
    
//     const tokenEndpoint = 'http://0.0.0.0:8080/realms/Oauth/protocol/openid-connect/token';
//     const redirectUri = 'http://localhost:4200/';  // Same as your OAuth redirect URI
//     const clientId = 'sourav';  // Your client ID
//     const clientSecret = '9LYozjDb59iHIbx4TFhbF6CLmfwiFLS5';  // Your client secret

//     const body = new HttpParams()
//       .set('grant_type', 'authorization_code')
//       .set('code', code)  // The authorization code from the redirect URL
//       .set('redirect_uri', redirectUri)
//       .set('client_id', clientId)
//       .set('client_secret', clientSecret);

//     const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

//     return this.http.post(tokenEndpoint, body, { headers });
//   }

//   // Method to handle redirect after OAuth login (handle URL params)
//   handleRedirectAfterLogin(): void {
//     console.log("Calling handleRedirectAfterLogin");
    
//     const urlParams = new URLSearchParams(window.location.search);
//     console.log("URL Params:", urlParams);
    
//     const code = urlParams.get('code');
    
//     if (code) {
//       // Exchange authorization code for access token
//       this.exchangeAuthorizationCodeForTokens(code).subscribe(
//         response => {
//           console.log('Token Response:', response);
          
//           // Store tokens in localStorage or sessionStorage
//           localStorage.setItem('access_token', response.access_token);
//           sessionStorage.setItem('access_token', response.access_token);
          
//           // Optionally, store refresh token if needed
//           if (response.refresh_token) {
//             localStorage.setItem('refresh_token', response.refresh_token);
//             sessionStorage.setItem('refresh_token', response.refresh_token);
//           }
//         },
//         error => {
//           console.error('Error exchanging authorization code:', error);
//         }
//       );
//     } else {
//       console.log('No authorization code found in URL');
//     }
//   }

//   // Make an API request using the access token
//   makeApiRequest(): Observable<any> {
//     console.log("Calling makeApiRequest");
//     const accessToken = this.oauthService.getAccessToken();
    
//     if (accessToken) {
//       const headers = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken);
//       return this.http.get('http://localhost:8080/protected-resource', { headers });
//     } else {
//       console.log('Access token is missing.');
//       throw new Error('Access token is missing');
//     }
//   }

//   // Refresh the access token using refresh token if needed
//   refreshAccessToken(): void {
//     console.log("Calling refreshAccessToken");
//     this.oauthService.refreshToken().then(() => {
//       const newAccessToken = this.oauthService.getAccessToken();
//       console.log("New Access Token: " + newAccessToken);
//       localStorage.setItem('access_token', newAccessToken);  // Persist the new token
//       sessionStorage.setItem('access_token', newAccessToken); // Persist the new token for session
//     }).catch((error) => {
//       console.error('Error refreshing access token:', error);
//     });
//   }
// }




