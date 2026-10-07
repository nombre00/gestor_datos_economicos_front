import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaApilada } from './area-apilada';

describe('AreaApilada', () => {
  let component: AreaApilada;
  let fixture: ComponentFixture<AreaApilada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaApilada],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaApilada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
