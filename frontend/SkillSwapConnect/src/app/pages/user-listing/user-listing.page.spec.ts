import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserListingPage } from './user-listing.page';

describe('UserListingPage', () => {
  let component: UserListingPage;
  let fixture: ComponentFixture<UserListingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListingPage ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

