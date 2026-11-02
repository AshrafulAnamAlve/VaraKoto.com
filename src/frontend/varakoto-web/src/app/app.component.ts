import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { LogoComponent } from './shared/components/logo/logo.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LogoComponent, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  readonly themeService = inject(ThemeService);
  protected readonly title = signal('VaraKoto.com');
  readonly showLoadingPreview = signal(false);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLoadingPreview(): void {
    this.showLoadingPreview.update(prev => !prev);
  }
}
