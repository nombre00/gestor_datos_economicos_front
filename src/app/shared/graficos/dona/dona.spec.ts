import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dona } from './dona';

describe('Dona', () => {
  let component: Dona;
  let fixture: ComponentFixture<Dona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dona],
    }).compileComponents();

    fixture = TestBed.createComponent(Dona);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
