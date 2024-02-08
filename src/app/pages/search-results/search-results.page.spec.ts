import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultsPage } from './search-results.page';

describe('SearchResultsPage', () => {
  let component: SearchResultsPage;
  let fixture: ComponentFixture<SearchResultsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
