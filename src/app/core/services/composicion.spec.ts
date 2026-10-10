import { TestBed } from '@angular/core/testing';
import { Composicion } from './composicion';

describe('Composicion', () => {
  let service: Composicion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Composicion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
