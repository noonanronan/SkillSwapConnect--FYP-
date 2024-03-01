import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SearchResultsPage } from './search-results.page';

describe('SearchResultsPage', () => {
  let component: SearchResultsPage;
  let fixture: ComponentFixture<SearchResultsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsPage ]
      // add any necessary testing module configurations here
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
