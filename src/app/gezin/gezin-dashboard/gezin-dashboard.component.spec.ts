import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GezinDashboardComponent } from './gezin-dashboard.component';

describe('GezinDashboardComponent', () => {
  let component: GezinDashboardComponent;
  let fixture: ComponentFixture<GezinDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GezinDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GezinDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
