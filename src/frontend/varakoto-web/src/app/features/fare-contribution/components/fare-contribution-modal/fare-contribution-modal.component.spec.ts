import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FareContributionModalComponent } from './fare-contribution-modal.component';
import { FareService } from '../../../../core/services/fare.service';
import { LocationService } from '../../../../core/services/location.service';
import { FareContributionResponseModel } from '../../../../core/models/fare.model';

describe('FareContributionModalComponent', () => {
  let component: FareContributionModalComponent;
  let fixture: ComponentFixture<FareContributionModalComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FareContributionModalComponent],
      providers: [
        FareService,
        LocationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FareContributionModalComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal backdrop when isOpen is false', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.modal-backdrop')).toBeNull();
  });

  it('should display modal when isOpen input is set to true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.modal-backdrop')).toBeTruthy();
    expect(el.querySelector('.modal-title')?.textContent).toContain('ভাড়া শেয়ার করুন');
  });

  it('should initialize input fields when initial inputs change', () => {
    fixture.componentRef.setInput('initialFrom', 'মিরপুর ১০');
    fixture.componentRef.setInput('initialTo', 'ফার্মগেট');
    fixture.componentRef.setInput('initialTransport', 'cng');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    expect(component.fromText()).toBe('মিরপুর ১০');
    expect(component.toText()).toBe('ফার্মগেট');
    expect(component.transportCode()).toBe('cng');
  });

  it('should show error when submitting without required fields', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    // Empty from
    component.fromText.set('');
    component.onSubmit();
    expect(component.errorMessage()).toContain('কোথা থেকে যাত্রা করেছেন লিখুন');

    // From provided, but empty to
    component.fromText.set('ধানমন্ডি');
    component.toText.set('');
    component.onSubmit();
    expect(component.errorMessage()).toContain('গন্তব্য স্থান লিখুন');

    // Missing or invalid fare (< 10)
    component.toText.set('শাহবাগ');
    component.actualFare.set(5);
    component.onSubmit();
    expect(component.errorMessage()).toContain('সর্বনিম্ন ১০ টাকা');
  });

  it('should emit closeModal when close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let closed = false;
    component.closeModal.subscribe(() => {
      closed = true;
    });

    const closeBtn = fixture.nativeElement.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.click();
    expect(closed).toBe(true);
  });

  it('should submit valid fare contribution and show success view', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.fromText.set('মিরপুর ১০');
    component.toText.set('ফার্মগেট');
    component.transportCode.set('bus');
    component.actualFare.set(35);

    let emittedResponse: FareContributionResponseModel | null = null;
    component.fareContributed.subscribe((res) => {
      emittedResponse = res;
    });

    component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    const mockResponse: FareContributionResponseModel = {
      submissionId: 42,
      messageEn: 'Thank you for sharing!',
      messageBn: 'আপনার ভাড়া সফলভাবে গৃহীত হয়েছে!',
      status: 'Approved',
      calculatedStandardFare: 35,
      submittedFare: 35,
      fromLocationName: 'মিরপুর ১০',
      toLocationName: 'ফার্মগেট',
      transportName: 'বাস',
      submittedAt: new Date().toISOString()
    };

    const req = httpTesting.expectOne('http://localhost:5293/api/fares/contribute');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.actualFarePaid).toBe(35);
    req.flush(mockResponse);

    fixture.detectChanges();

    expect(component.isSubmitting()).toBe(false);
    expect(component.successData()).toEqual(mockResponse);
    expect(emittedResponse).toEqual(mockResponse);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.success-title')?.textContent).toContain('ভাড়া সফলভাবে যুক্ত হয়েছে');
    expect(el.querySelector('.fare-highlight')?.textContent).toContain('৳35');
  });
});
