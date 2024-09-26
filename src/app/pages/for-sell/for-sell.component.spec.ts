import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForSellComponent } from './for-sell.component';

describe('ForSellComponent', () => {
  let component: ForSellComponent;
  let fixture: ComponentFixture<ForSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
