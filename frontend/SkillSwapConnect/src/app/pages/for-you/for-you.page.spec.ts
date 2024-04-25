import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForYouPage } from './for-you.page';

describe('ForYouPage', () => {
  let component: ForYouPage;
  let fixture: ComponentFixture<ForYouPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForYouPage ]
      // Add any necessary test module setup or providers here
    })
    .compileComponents();  // Compile components to be ready for testing
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForYouPage);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Trigger a change detection cycle for the setup
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Test to check if the component is created successfully
  });
});
