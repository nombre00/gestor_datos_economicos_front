import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PorAcreedor } from './por-acreedor';

describe('PorAcreedor', () => {
  let component: PorAcreedor;
  let fixture: ComponentFixture<PorAcreedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorAcreedor],
    }).compileComponents();

    fixture = TestBed.createComponent(PorAcreedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
