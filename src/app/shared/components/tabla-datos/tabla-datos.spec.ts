import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaDatos } from './tabla-datos';

describe('TablaDatos', () => {
  let component: TablaDatos;
  let fixture: ComponentFixture<TablaDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
