import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Share, ShareOptions } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

@Injectable({
  providedIn: 'root'
})
export class NativeMobileService {
  /**
   * Whether the app is running as a native mobile app (Capacitor Android or iOS).
   */
  readonly isNative = Capacitor.isNativePlatform();

  /**
   * The current platform name ('android' | 'ios' | 'web').
   */
  readonly platform = Capacitor.getPlatform();

  constructor() {
    this.initNativeFeatures();
  }

  private async initNativeFeatures(): Promise<void> {
    if (!this.isNative) return;

    try {
      // Hide native splash screen after Angular app bootstrap
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch {
      // Ignored if splash screen is unavailable
    }
  }

  /**
   * Light haptic feedback for button taps and vehicle selectors.
   */
  async hapticSelection(): Promise<void> {
    try {
      if (this.isNative) {
        await Haptics.selectionChanged();
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {
      // Silently catch if unsupported
    }
  }

  /**
   * Impact haptic feedback (e.g. on fare calculation button click).
   */
  async hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    try {
      if (this.isNative) {
        const capStyle =
          style === 'heavy'
            ? ImpactStyle.Heavy
            : style === 'light'
            ? ImpactStyle.Light
            : ImpactStyle.Medium;
        await Haptics.impact({ style: capStyle });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(style === 'heavy' ? 30 : style === 'light' ? 12 : 20);
      }
    } catch {
      // Silently catch if unsupported
    }
  }

  /**
   * Notification haptic feedback (success on fare result or fare submission).
   */
  async hapticSuccess(): Promise<void> {
    try {
      if (this.isNative) {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([15, 30, 15]);
      }
    } catch {
      // Silently catch if unsupported
    }
  }

  /**
   * Native device GPS location detection with high accuracy and network fallback.
   */
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    if (this.isNative) {
      try {
        const isGranted = (p: any) => p?.location === 'granted' || p?.coarseLocation === 'granted';
        const perm = await Geolocation.checkPermissions();

        if (!isGranted(perm)) {
          const req = await Geolocation.requestPermissions();
          if (!isGranted(req)) {
            throw new Error('লোকেশন ব্যবহারের অনুমতি দেওয়া হয়নি (Location permission denied)');
          }
        }

        // First attempt high accuracy (GPS satellites)
        try {
          const pos: Position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 10000
          });

          return {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (highAccErr) {
          // Graceful fallback to low accuracy (WiFi / cell tower triangulation)
          const fallbackPos: Position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 60000
          });

          return {
            latitude: fallbackPos.coords.latitude,
            longitude: fallbackPos.coords.longitude
          };
        }
      } catch (err: any) {
        // Fallback to browser Geolocation API inside WebView if native plugin encounters unexpected issue
        try {
          return await this.getBrowserPosition();
        } catch {
          throw new Error(err?.message || 'জিপিএস অবস্থান নির্ধারণ করা সম্ভব হয়নি');
        }
      }
    }

    // Web fallback
    return this.getBrowserPosition();
  }

  private getBrowserPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('এই ডিভাইসে লোকেশন ফিচার সমর্থিত নয়'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          // If high accuracy failed in browser, try low accuracy
          navigator.geolocation.getCurrentPosition(
            (fallbackPos) => {
              resolve({
                latitude: fallbackPos.coords.latitude,
                longitude: fallbackPos.coords.longitude
              });
            },
            () => {
              reject(new Error(err?.message || 'লোকেশন অ্যাক্সেস করা যায়নি'));
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
      );
    });
  }

  /**
   * Native Share sheet (share fare results via WhatsApp, Facebook, SMS, etc.).
   */
  async shareFare(options: { title: string; text: string; url?: string }): Promise<boolean> {
    try {
      if (this.isNative) {
        const canShare = await Share.canShare();
        if (canShare.value) {
          await Share.share({
            title: options.title,
            text: options.text,
            url: options.url || 'https://varakoto.com',
            dialogTitle: options.title
          });
          return true;
        }
      }

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url || window.location.href
        });
        return true;
      }
    } catch {
      // User cancelled share or unsupported
    }
    return false;
  }

  /**
   * Configure native Android/iOS status bar for Dark/Light mode theme.
   */
  async updateStatusBarTheme(isDark: boolean): Promise<void> {
    if (!this.isNative) return;

    try {
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
      await StatusBar.setBackgroundColor({ color: isDark ? '#071F1B' : '#FFF6E5' });
    } catch {
      // Ignored if unsupported on platform
    }
  }
}
