import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteitFormComponent } from './activiteit-form.component';

describe('ActiviteitFormComponent', () => {
  let component: ActiviteitFormComponent;
  let fixture: ComponentFixture<ActiviteitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
