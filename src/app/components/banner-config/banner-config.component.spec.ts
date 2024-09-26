import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerConfigComponent } from './banner-config.component';

describe('BannerConfigComponent', () => {
  let component: BannerConfigComponent;
  let fixture: ComponentFixture<BannerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
