import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserDetailPage } from './user-detail.page';

describe('UserDetailPage', () => {
  let component: UserDetailPage;
  let fixture: ComponentFixture<UserDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailPage ],
      // Add any necessary test module imports here
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
