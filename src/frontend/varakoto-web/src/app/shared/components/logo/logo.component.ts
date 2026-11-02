import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

export type LogoVariant = 'primary' | 'stacked' | 'compact' | 'icon-only';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  private readonly themeService = inject(ThemeService);

  readonly variant = input<LogoVariant>('primary');
  readonly mode = input<'light' | 'dark' | 'auto'>('auto');
  readonly showTagline = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly isDark = computed(() => {
    const m = this.mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    return this.themeService.isDark();
  });
}
