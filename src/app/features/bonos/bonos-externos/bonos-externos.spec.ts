import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonosExternos } from './bonos-externos';

describe('BonosExternos', () => {
  let component: BonosExternos;
  let fixture: ComponentFixture<BonosExternos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonosExternos],
    }).compileComponents();

    fixture = TestBed.createComponent(BonosExternos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
