import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Plazo } from './plazo';

describe('Plazo', () => {
  let component: Plazo;
  let fixture: ComponentFixture<Plazo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plazo],
    }).compileComponents();

    fixture = TestBed.createComponent(Plazo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
