import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoTasaPlazo } from './grafico-tasa-plazo';

describe('GraficoTasaPlazo', () => {
  let component: GraficoTasaPlazo;
  let fixture: ComponentFixture<GraficoTasaPlazo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTasaPlazo],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoTasaPlazo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
