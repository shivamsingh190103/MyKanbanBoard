import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyKanbanComponent } from './my-kanban.component';

describe('MyKanbanComponent', () => {
  let component: MyKanbanComponent;
  let fixture: ComponentFixture<MyKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyKanbanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
