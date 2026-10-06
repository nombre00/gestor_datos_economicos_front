import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gobierno } from './gobierno';

describe('Gobierno', () => {
  let component: Gobierno;
  let fixture: ComponentFixture<Gobierno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gobierno],
    }).compileComponents();

    fixture = TestBed.createComponent(Gobierno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
