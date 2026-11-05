import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DistrictSelectorModalComponent } from './district-selector-modal.component';
import { DistrictService } from '../../../core/services/district.service';
import { BANGLADESH_DISTRICTS } from '../../../core/data/districts.data';

describe('DistrictSelectorModalComponent', () => {
  let component: DistrictSelectorModalComponent;
  let fixture: ComponentFixture<DistrictSelectorModalComponent>;
  let districtService: DistrictService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DistrictSelectorModalComponent],
      providers: [DistrictService]
    }).compileComponents();

    fixture = TestBed.createComponent(DistrictSelectorModalComponent);
    component = fixture.componentInstance;
    districtService = TestBed.inject(DistrictService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter districts when searching', () => {
    component.searchQuery.set('রাঙ্গামাটি');
    expect(component.filteredDistricts().length).toBe(1);
    expect(component.filteredDistricts()[0].id).toBe('rangamati');
  });

  it('should select district and close modal', () => {
    const rangamati = BANGLADESH_DISTRICTS.find(d => d.id === 'rangamati')!;
    component.selectDistrict(rangamati);

    expect(districtService.currentDistrict().id).toBe('rangamati');
    expect(districtService.isModalOpen()).toBe(false);
  });

  it('should close modal when close() is called', () => {
    component.close();
    expect(districtService.isModalOpen()).toBe(false);
  });
});
