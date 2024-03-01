import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessagingPage } from './messaging.page';

describe('MessagingPage', () => {
  let component: MessagingPage;
  let fixture: ComponentFixture<MessagingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MessagingPage]
      // add any necessary testing module configurations here
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
