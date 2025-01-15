import { TestBed } from '@angular/core/testing';

import { Oauth2ConfigService } from './oauth2-config.service';

describe('Oauth2ConfigService', () => {
  let service: Oauth2ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Oauth2ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
