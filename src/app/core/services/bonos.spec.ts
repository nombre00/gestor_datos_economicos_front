import { TestBed } from '@angular/core/testing';
import { Bonos } from './bonos';

describe('Bonos', () => {
  let service: Bonos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bonos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
