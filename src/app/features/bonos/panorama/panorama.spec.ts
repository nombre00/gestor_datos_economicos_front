import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Panorama } from './panorama';

describe('Panorama', () => {
  let component: Panorama;
  let fixture: ComponentFixture<Panorama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panorama],
    }).compileComponents();

    fixture = TestBed.createComponent(Panorama);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
