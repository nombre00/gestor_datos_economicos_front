import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Burbujas } from './burbujas';

describe('Burbujas', () => {
  let component: Burbujas;
  let fixture: ComponentFixture<Burbujas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Burbujas],
    }).compileComponents();

    fixture = TestBed.createComponent(Burbujas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
