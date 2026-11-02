import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FareFinderCardComponent } from '../../components/fare-finder-card/fare-finder-card.component';
import { FareResultCardComponent } from '../../components/fare-result-card/fare-result-card.component';
import { FareContributionModalComponent } from '../../../fare-contribution/components/fare-contribution-modal/fare-contribution-modal.component';
import { LoadingScreenComponent } from '../../../../shared/components/loading-screen/loading-screen.component';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { FareService } from '../../../../core/services/fare.service';
import { FareContributionResponseModel, TransportCode } from '../../../../core/models/fare.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FareFinderCardComponent,
    FareResultCardComponent,
    FareContributionModalComponent,
    LoadingScreenComponent,
    LogoComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly fareService = inject(FareService);

  // View state: 'finder' | 'result'
  readonly currentView = signal<'finder' | 'result'>('finder');

  // Contribution Modal State
  readonly isContributionModalOpen = signal<boolean>(false);
  readonly contributionInitialFrom = signal<string>('');
  readonly contributionInitialTo = signal<string>('');
  readonly contributionInitialTransport = signal<TransportCode>('bus');

  ngOnInit(): void {
    // Load recent approved contributions for the community section
    this.fareService.loadRecentContributions(6).subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  showFinder(): void {
    this.currentView.set('finder');
    this.fareService.clearResult();
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
  }

  handleContribute(event: { fromLocation?: string; toLocation?: string; transport?: string }): void {
    this.openContributionModal(event.fromLocation, event.toLocation, event.transport);
  }

  handleFareContributed(response: FareContributionResponseModel): void {
    // Refresh recent contributions after a new one is submitted
    this.fareService.loadRecentContributions(6).subscribe();
  }
}
