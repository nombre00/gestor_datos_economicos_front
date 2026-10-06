import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PorMoneda } from './por-moneda';

describe('PorMoneda', () => {
  let component: PorMoneda;
  let fixture: ComponentFixture<PorMoneda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorMoneda],
    }).compileComponents();

    fixture = TestBed.createComponent(PorMoneda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
