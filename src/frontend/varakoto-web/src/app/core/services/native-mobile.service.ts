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
            throw new Error('ফোনের সেটিংসে গিয়ে VaraKoto অ্যাপের লোকেশন পারমিশন অন করুন');
          }
        }

        // 1. Try high accuracy with cached position support
        try {
          const pos: Position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Accept positions up to 5 min old for instant return
          });

          return {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (highAccErr: any) {
          // If location is disabled on the phone, throw immediately with helpful advice
          const msg = (highAccErr?.message || '').toLowerCase();
          if (msg.includes('disabled') || msg.includes('not enabled')) {
            throw new Error('ফোনের জিপিএস / লোকেশন সার্ভিসটি অন করুন');
          }

          // 2. Fallback to network/cell tower triangulation (works indoors)
          const fallbackPos: Position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 600000 // 10 minutes
          });

          return {
            latitude: fallbackPos.coords.latitude,
            longitude: fallbackPos.coords.longitude
          };
        }
      } catch (err: any) {
        // Fallback to browser Geolocation API inside WebView if native plugin encountered issues
        try {
          return await this.getBrowserPosition();
        } catch {
          const msg = (err?.message || '').toLowerCase();
          if (msg.includes('disabled') || msg.includes('not enabled')) {
            throw new Error('ফোনের জিপিএস / লোকেশন সার্ভিসটি অন করুন');
          }
          if (msg.includes('denied') || msg.includes('permission')) {
            throw new Error('লোকেশন পারমিশন দেওয়া হয়নি। ফোনের সেটিংসে গিয়ে পারমিশন অন করুন অথবা ম্যাপে পিন করুন।');
          }
          throw new Error(err?.message || 'জিপিএস অবস্থান পাওয়া যায়নি। অনুগ্রহ করে ম্যাপ থেকে পিন করুন।');
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
              if (err.code === 1) {
                reject(new Error('ব্রাউজার বা ডিভাইসে লোকেশন পারমিশন দেওয়া হয়নি'));
              } else if (err.code === 2) {
                reject(new Error('ফোনের জিপিএস / লোকেশন সার্ভিসটি অন করুন'));
              } else {
                reject(new Error('লোকেশন অবস্থান পেতে সময় বেশি লাগছে। ম্যাপ থেকে পিন করুন।'));
              }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
          );
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 180000 }
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
