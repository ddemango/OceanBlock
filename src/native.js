// Native-app glue (Capacitor). Everything here is a no-op in a normal browser.
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = Capacitor.isNativePlatform();

export async function initNative() {
  if (!isNative) return;
  try {
    await StatusBar.hide();
  } catch {
    /* not available on this platform */
  }
  try {
    await SplashScreen.hide();
  } catch {
    /* ignore */
  }
}

// Strong buzz for big moments, light tap otherwise.
export function nativeVibrate(pattern) {
  const ms = Array.isArray(pattern) ? pattern.reduce((a, b) => a + b, 0) : pattern;
  Haptics.impact({ style: ms > 40 ? ImpactStyle.Heavy : ImpactStyle.Medium }).catch(() => {});
}
