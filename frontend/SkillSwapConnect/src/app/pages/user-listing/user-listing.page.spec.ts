import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListingPage } from './user-listing.page';

describe('UserListingPage', () => {
  let component: UserListingPage;
  let fixture: ComponentFixture<UserListingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
