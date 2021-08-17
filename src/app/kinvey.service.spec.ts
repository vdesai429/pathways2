import { TestBed } from '@angular/core/testing';

import { KinveyService } from './kinvey.service';

describe('KinveyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KinveyService = TestBed.get(KinveyService);
    expect(service).toBeTruthy();
  });
});
