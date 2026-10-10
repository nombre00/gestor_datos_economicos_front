import { TestBed } from '@angular/core/testing';
import { SerieHistorica } from './serie-historica';

describe('SerieHistorica', () => {
  let service: SerieHistorica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerieHistorica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
