import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonosLocales } from './bonos-locales';

describe('BonosLocales', () => {
  let component: BonosLocales;
  let fixture: ComponentFixture<BonosLocales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonosLocales],
    }).compileComponents();

    fixture = TestBed.createComponent(BonosLocales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
