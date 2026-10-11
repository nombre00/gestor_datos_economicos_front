import { TestBed } from '@angular/core/testing';
import { Tenedores } from './tenedores';

describe('Tenedores', () => {
  let service: Tenedores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tenedores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
