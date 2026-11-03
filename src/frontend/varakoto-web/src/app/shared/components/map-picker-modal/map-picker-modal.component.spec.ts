import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MapPickerModalComponent } from './map-picker-modal.component';

describe('MapPickerModalComponent', () => {
  let component: MapPickerModalComponent;
  let fixture: ComponentFixture<MapPickerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPickerModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapPickerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed when close is called', () => {
    let closedEmitted = false;
    component.closed.subscribe(() => {
      closedEmitted = true;
    });

    component.close();
    expect(closedEmitted).toBe(true);
  });

  it('should emit locationSelected on confirmSelection', () => {
    let selectedLocation: any = null;
    component.locationSelected.subscribe((loc) => {
      selectedLocation = loc;
    });

    component.placeName.set('কালিয়াকৈর বাজার');
    component.currentLat.set(24.07);
    component.currentLng.set(90.22);

    component.confirmSelection();
    expect(selectedLocation).toBeTruthy();
    expect(selectedLocation.name).toBe('কালিয়াকৈর বাজার');
    expect(selectedLocation.latitude).toBe(24.07);
    expect(selectedLocation.longitude).toBe(90.22);
  });
});
