import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Oauth2ConfigService } from '../service/oauth2-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  private isInitialized = false;

  constructor(
    private oauthService: OAuthService,
    private oauth2configuration: Oauth2ConfigService,
    private router: Router
  ) {
    console.log('Enter into BodyComponent');
    oauth2configuration.handleRedirectAfterLogin();
    if (localStorage.getItem('refresh') === 'refresh') {
      window.location.reload();
    }
  }


  ngOnInit(): void {
    console.log('call once');
    // window.location.reload();
  }
}
