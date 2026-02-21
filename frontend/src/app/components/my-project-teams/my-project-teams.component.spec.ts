import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectTeamComponent } from './my-project-teams.component';

describe('MyProjectTeamsComponent', () => {
  let component: MyProjectTeamComponent;
  let fixture: ComponentFixture<MyProjectTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProjectTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProjectTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
