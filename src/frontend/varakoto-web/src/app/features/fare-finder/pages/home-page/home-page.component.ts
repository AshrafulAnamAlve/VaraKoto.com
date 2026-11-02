import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareFinderCardComponent } from '../../components/fare-finder-card/fare-finder-card.component';
import { FareResultCardComponent } from '../../components/fare-result-card/fare-result-card.component';
import { LoadingScreenComponent } from '../../../../shared/components/loading-screen/loading-screen.component';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { FareService } from '../../../../core/services/fare.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    FareFinderCardComponent,
    FareResultCardComponent,
    LoadingScreenComponent,
    LogoComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  readonly themeService = inject(ThemeService);
  readonly fareService = inject(FareService);

  // View state: 'finder' | 'result'
  readonly currentView = signal<'finder' | 'result'>('finder');

  constructor() {
    // Watch latestResult: if available and view is finder, switch to result
    // (effect can handle reactive transitions)
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  showFinder(): void {
    this.currentView.set('finder');
    this.fareService.clearResult();
  }

  handleContribute(event: { fromLocation?: string; toLocation?: string; transport?: string }): void {
    alert(`ভাড়া শেয়ার সুবিধাটি Phase 7-এ সম্পূর্ণ যুক্ত হচ্ছে!\nরুট: ${event.fromLocation || ''} -> ${event.toLocation || ''}`);
  }
}
