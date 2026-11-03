import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { LocationService } from '../../../core/services/location.service';

export interface SelectedMapLocation {
  name: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

@Component({
  selector: 'app-map-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-picker-modal.component.html',
  styleUrls: ['./map-picker-modal.component.scss']
})
export class MapPickerModalComponent implements OnDestroy {
  private readonly locationService = inject(LocationService);

  // Inputs
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('ম্যাপ থেকে স্থান নির্বাচন করুন');
  readonly fieldLabel = input<string>('যাত্রার স্থান');
  readonly initialLat = input<number>(23.8103);
  readonly initialLng = input<number>(90.4125);
  readonly initialName = input<string>('');

  // Outputs
  readonly locationSelected = output<SelectedMapLocation>();
  readonly closed = output<void>();

  // Template refs
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  // Component State Signals
  readonly currentLat = signal<number>(23.8103);
  readonly currentLng = signal<number>(90.4125);
  readonly placeName = signal<string>('');
  readonly isReverseGeocoding = signal<boolean>(false);
  readonly isDetectingGps = signal<boolean>(false);

  private map?: L.Map;
  private marker?: L.Marker;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        // Initialize state from inputs
        this.currentLat.set(this.initialLat() || 23.8103);
        this.currentLng.set(this.initialLng() || 90.4125);
        this.placeName.set(this.initialName() || '');

        // Wait for DOM to render modal container before initializing Leaflet
        setTimeout(() => {
          this.initMap();
        }, 150);
      } else {
        this.destroyMap();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) return;
    this.destroyMap();

    const lat = this.currentLat();
    const lng = this.currentLng();

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Custom crisp SVG Pin Marker
    const pinIcon = L.divIcon({
      className: 'leaflet-custom-marker',
      html: `
        <div class="pin-wrapper">
          <div class="pin-pulse"></div>
          <div class="pin-icon">📍</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 38]
    });

    this.marker = L.marker([lat, lng], {
      icon: pinIcon,
      draggable: true
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker?.getLatLng();
      if (pos) {
        this.updateCoordinates(pos.lat, pos.lng);
      }
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker?.setLatLng(e.latlng);
      this.updateCoordinates(e.latlng.lat, e.latlng.lng);
    });

    // Auto invalidate size in case container animation completes
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 300);

    if (!this.placeName()) {
      this.fetchAddressForCoordinates(lat, lng);
    }
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  updateCoordinates(lat: number, lng: number): void {
    this.currentLat.set(Number(lat.toFixed(6)));
    this.currentLng.set(Number(lng.toFixed(6)));
    this.fetchAddressForCoordinates(lat, lng);
  }

  private fetchAddressForCoordinates(lat: number, lng: number): void {
    this.isReverseGeocoding.set(true);
    this.locationService.reverse(lat, lng).subscribe({
      next: (loc) => {
        this.isReverseGeocoding.set(false);
        if (loc) {
          this.placeName.set(loc.nameBn || loc.displayName || loc.nameEn);
        } else {
          if (!this.placeName()) {
            this.placeName.set(`চিহ্নিত স্থান (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
          }
        }
      },
      error: () => {
        this.isReverseGeocoding.set(false);
        if (!this.placeName()) {
          this.placeName.set(`চিহ্নিত স্থান (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        }
      }
    });
  }

  detectUserLocation(): void {
    this.isDetectingGps.set(true);
    this.locationService.detectBrowserLocation().subscribe({
      next: (coords) => {
        this.isDetectingGps.set(false);
        this.currentLat.set(coords.latitude);
        this.currentLng.set(coords.longitude);

        if (this.map && this.marker) {
          const latLng = L.latLng(coords.latitude, coords.longitude);
          this.marker.setLatLng(latLng);
          this.map.setView(latLng, 15);
        }
        this.fetchAddressForCoordinates(coords.latitude, coords.longitude);
      },
      error: () => {
        this.isDetectingGps.set(false);
      }
    });
  }

  confirmSelection(): void {
    const lat = this.currentLat();
    const lng = this.currentLng();
    const name = this.placeName().trim() || `চিহ্নিত স্থান (${lat.toFixed(3)}, ${lng.toFixed(3)})`;

    this.locationSelected.emit({
      name,
      latitude: lat,
      longitude: lng,
      displayName: name
    });
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
