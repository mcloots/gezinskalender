import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteitDashboardComponent } from './activiteit-dashboard.component';

describe('ActiviteitDashboardComponent', () => {
  let component: ActiviteitDashboardComponent;
  let fixture: ComponentFixture<ActiviteitDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteitDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteitDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
