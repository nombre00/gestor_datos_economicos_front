import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoEvolucion } from './grafico-evolucion';

describe('GraficoEvolucion', () => {
  let component: GraficoEvolucion;
  let fixture: ComponentFixture<GraficoEvolucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoEvolucion],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoEvolucion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
