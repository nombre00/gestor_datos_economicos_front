import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoSpread } from './grafico-spread';

describe('GraficoSpread', () => {
  let component: GraficoSpread;
  let fixture: ComponentFixture<GraficoSpread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoSpread],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoSpread);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
