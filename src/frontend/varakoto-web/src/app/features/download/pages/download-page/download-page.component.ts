import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-download-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss']
})
export class DownloadPageComponent {
  readonly themeService = inject(ThemeService);
  readonly nativeMobile = inject(NativeMobileService);

  readonly appVersion = 'v1.1.0';
  readonly appSize = '~9.7 MB';
  readonly minAndroid = 'Android 7.0+';

  // Direct APK download link hosted in the web app
  readonly directDownloadUrl = 'downloads/varakoto.apk';

  // GitHub Releases mirror link
  readonly githubReleaseUrl = 'https://github.com/AshrafulAnamAlve/VaraKoto.com/releases/download/v1.1.0/VaraKoto.apk';

  readonly features = [
    { icon: '⚡', title: '৬০ FPS সিনেমাটিক রুট ম্যাপ', desc: 'কম্পিউটেড রোড গ্রিডে লাইভ অ্যানিমেশন' },
    { icon: '🚌', title: 'সব বাহনের সঠিক ভাড়া', desc: 'বাস, রিকশা, সিএনজি ও বাইক ক্যালকুলেটর' },
    { icon: '📍', title: 'মোবাইল জিপিএস লোকেশন', desc: 'এক ট্যাপে বর্তমান অবস্থান শনাক্তকরণ' },
    { icon: '📳', title: 'টাচ হ্যাপটিক ফিডব্যাক', desc: 'বাটন ও বাহন সিলেকশনে ভাইব্রেশন' },
    { icon: '📲', title: 'ভাড়া শেয়ার সুবিধা', desc: 'হোয়াটসঅ্যাপ বা মেসেঞ্জারে বন্ধুকে পাঠান' },
    { icon: '🌓', title: 'ডার্ক ও লাইট থিম', desc: 'চোখের স্বস্তিদায়ক প্রিমিয়াম ডিজাইন' }
  ];

  onDownloadClick(): void {
    this.nativeMobile.hapticImpact('medium');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.nativeMobile.updateStatusBarTheme(this.themeService.isDark());
    this.nativeMobile.hapticSelection();
  }
}
