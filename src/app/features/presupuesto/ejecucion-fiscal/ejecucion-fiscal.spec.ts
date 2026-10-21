import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjecucionFiscal } from './ejecucion-fiscal';

describe('EjecucionFiscal', () => {
  let component: EjecucionFiscal;
  let fixture: ComponentFixture<EjecucionFiscal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionFiscal],
    }).compileComponents();

    fixture = TestBed.createComponent(EjecucionFiscal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
