import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouteMapComponent } from '../../components/route-map/route-map.component';
import { FareFinderCardComponent } from '../../components/fare-finder-card/fare-finder-card.component';
import { FareResultCardComponent } from '../../components/fare-result-card/fare-result-card.component';
import { FareContributionModalComponent } from '../../../fare-contribution/components/fare-contribution-modal/fare-contribution-modal.component';
import { LoadingScreenComponent } from '../../../../shared/components/loading-screen/loading-screen.component';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { DistrictSelectorModalComponent } from '../../../../shared/components/district-selector-modal/district-selector-modal.component';
import { DistrictService } from '../../../../core/services/district.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { FareService } from '../../../../core/services/fare.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';
import { FareContributionResponseModel, TransportCode } from '../../../../core/models/fare.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouteMapComponent,
    FareFinderCardComponent,
    FareResultCardComponent,
    FareContributionModalComponent,
    LoadingScreenComponent,
    LogoComponent,
    DistrictSelectorModalComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly fareService = inject(FareService);
  readonly nativeMobile = inject(NativeMobileService);
  readonly districtService = inject(DistrictService);

  // View state: 'finder' | 'result'
  readonly currentView = signal<'finder' | 'result'>('finder');
  readonly replayTrigger = signal<number>(0);

  // Route Map Data (computed directly from the calculated fare result)
  readonly resultFrom = computed(() => {
    const res = this.fareService.latestResult();
    return res?.fromLocation?.nameBn || res?.fromLocation?.displayName || res?.fromLocation?.nameEn || '';
  });

  readonly resultTo = computed(() => {
    const res = this.fareService.latestResult();
    return res?.toLocation?.nameBn || res?.toLocation?.displayName || res?.toLocation?.nameEn || '';
  });

  readonly resultDistanceKm = computed(() => {
    return this.fareService.latestResult()?.distanceKm ?? null;
  });

  readonly resultDurationMinutes = computed(() => {
    return this.fareService.latestResult()?.estimatedDurationMinutes ?? null;
  });

  readonly resultFareAmount = computed(() => {
    const primary = this.fareService.latestResult()?.primaryFare;
    if (!primary) return null;
    return primary.exactFare ?? primary.estimatedMinFare;
  });

  readonly resultFareDisplayBn = computed(() => {
    return this.fareService.latestResult()?.primaryFare?.fareDisplayBn ?? '';
  });

  readonly resultVehicle = computed(() => {
    return this.fareService.selectedTransport();
  });

  // Contribution Modal State
  readonly isContributionModalOpen = signal<boolean>(false);
  readonly contributionInitialFrom = signal<string>('');
  readonly contributionInitialTo = signal<string>('');
  readonly contributionInitialTransport = signal<TransportCode>('bus');

  // Mobile App Native Bottom Nav & Info Sheet State
  readonly activeNavTab = signal<'finder' | 'share' | 'updates' | 'info'>('finder');
  readonly isInfoSheetOpen = signal<boolean>(false);

  ngOnInit(): void {
    // Sync native mobile status bar theme with initial dark/light state
    this.nativeMobile.updateStatusBarTheme(this.themeService.isDark());
    // Load recent approved contributions for the community section
    this.fareService.loadRecentContributions(6).subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.nativeMobile.updateStatusBarTheme(this.themeService.isDark());
    this.nativeMobile.hapticSelection();
  }

  showFinder(): void {
    this.nativeMobile.hapticSelection();
    this.activeNavTab.set('finder');
    this.currentView.set('finder');
    this.fareService.clearResult();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openInfoSheet(): void {
    this.nativeMobile.hapticSelection();
    this.isInfoSheetOpen.set(true);
    this.activeNavTab.set('info');
  }

  closeInfoSheet(): void {
    this.isInfoSheetOpen.set(false);
    this.activeNavTab.set('finder');
  }

  onSelectNavTab(tab: 'finder' | 'share' | 'updates' | 'info'): void {
    this.nativeMobile.hapticSelection();
    if (tab === 'finder') {
      this.activeNavTab.set('finder');
      this.showFinder();
    } else if (tab === 'share') {
      this.openContributionModal();
    } else if (tab === 'updates') {
      this.activeNavTab.set('updates');
      if (typeof window !== 'undefined') {
        const element = document.querySelector('.recent-contributions-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else if (tab === 'info') {
      this.openInfoSheet();
    }
  }

  onSearchSubmitted(): void {
    this.nativeMobile.hapticSuccess();
    this.replayTrigger.update(v => v + 1);
    if (typeof window !== 'undefined' && window.innerWidth <= 960) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openContributionModal(from?: string, to?: string, transport?: string): void {
    this.contributionInitialFrom.set(from || '');
    this.contributionInitialTo.set(to || '');
    if (transport && ['bus', 'rickshaw', 'cng', 'bike'].includes(transport.toLowerCase())) {
      this.contributionInitialTransport.set(transport.toLowerCase() as TransportCode);
    } else {
      this.contributionInitialTransport.set('bus');
    }
    this.isContributionModalOpen.set(true);
  }

  closeContributionModal(): void {
    this.isContributionModalOpen.set(false);
    this.activeNavTab.set('finder');
  }

  handleContribute(event: { fromLocation?: string; toLocation?: string; transport?: string }): void {
    this.openContributionModal(event.fromLocation, event.toLocation, event.transport);
  }

  handleFareContributed(response: FareContributionResponseModel): void {
    // Refresh recent contributions after a new one is submitted
    this.fareService.loadRecentContributions(6).subscribe();
  }
}
