import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarrasApiladas } from './barras-apiladas';

describe('BarrasApiladas', () => {
  let component: BarrasApiladas;
  let fixture: ComponentFixture<BarrasApiladas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarrasApiladas],
    }).compileComponents();

    fixture = TestBed.createComponent(BarrasApiladas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
