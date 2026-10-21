import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Financiamiento } from './financiamiento';

describe('Financiamiento', () => {
  let component: Financiamiento;
  let fixture: ComponentFixture<Financiamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Financiamiento],
    }).compileComponents();

    fixture = TestBed.createComponent(Financiamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
