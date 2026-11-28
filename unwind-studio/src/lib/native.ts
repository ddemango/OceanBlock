// Native-app glue (Capacitor iOS). Everything here is a no-op in a normal browser.
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export const isNative = Capacitor.isNativePlatform();

export async function initNative() {
  if (!isNative) return;
  document.documentElement.classList.add('native');
  // the app handles its own zooming on the artwork; stop the whole page from pinch-zooming
  document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  try { await SplashScreen.hide(); } catch { /* ignore */ }
}

/** Keep the status bar text readable against the current theme. */
export function setNativeTheme(dark: boolean) {
  if (!isNative) return;
  StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
}

export function nativeHaptic(strength: 'light' | 'medium' | 'heavy') {
  const style = strength === 'heavy' ? ImpactStyle.Heavy : strength === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
  Haptics.impact({ style }).catch(() => {});
}
