import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoVencimientos } from './grafico-vencimientos';

describe('GraficoVencimientos', () => {
  let component: GraficoVencimientos;
  let fixture: ComponentFixture<GraficoVencimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoVencimientos],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoVencimientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
