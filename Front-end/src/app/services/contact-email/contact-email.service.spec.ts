import { TestBed } from '@angular/core/testing';

import { ContactEmailService } from './contact-email.service';

describe('ContactEmailService', () => {
  let service: ContactEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
