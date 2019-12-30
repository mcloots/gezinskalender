import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GezinslidFormComponent } from './gezinslid-form.component';

describe('GezinslidFormComponent', () => {
  let component: GezinslidFormComponent;
  let fixture: ComponentFixture<GezinslidFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GezinslidFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GezinslidFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
