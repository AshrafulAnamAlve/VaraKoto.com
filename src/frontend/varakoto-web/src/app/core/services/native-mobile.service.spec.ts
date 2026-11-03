import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { NativeMobileService } from './native-mobile.service';

describe('NativeMobileService', () => {
  let service: NativeMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeMobileService]
    });
    service = TestBed.inject(NativeMobileService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should detect current platform environment', () => {
    expect(typeof service.isNative).toBe('boolean');
    expect(typeof service.platform).toBe('string');
  });

  it('should safely execute haptic triggers without crashing on web', async () => {
    await expect(service.hapticSelection()).resolves.toBeUndefined();
    await expect(service.hapticImpact('light')).resolves.toBeUndefined();
    await expect(service.hapticSuccess()).resolves.toBeUndefined();
  });

  it('should handle shareFare gracefully', async () => {
    const result = await service.shareFare({
      title: 'মিরপুর থেকে ফার্মগেট বাস ভাড়া',
      text: 'ভাড়া ৩৫ টাকা - VaraKoto.com'
    });
    expect(typeof result).toBe('boolean');
  });

  it('should safely execute status bar theme updates', async () => {
    await expect(service.updateStatusBarTheme(true)).resolves.toBeUndefined();
    await expect(service.updateStatusBarTheme(false)).resolves.toBeUndefined();
  });
});
