import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignUpPage } from './signup.page';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpPage ]
      // other configurations
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SignUpPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
