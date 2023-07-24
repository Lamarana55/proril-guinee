import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVenteComponent } from './search-vente.component';

describe('SearchVenteComponent', () => {
  let component: SearchVenteComponent;
  let fixture: ComponentFixture<SearchVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchVenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
