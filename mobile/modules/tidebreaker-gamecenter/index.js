import { Platform } from 'react-native';

// Native Game Center module (iOS only). Everything becomes a no-op elsewhere.
let native = null;
if (Platform.OS === 'ios') {
  try {
    native = require('expo-modules-core').requireNativeModule('TidebreakerGameCenter');
  } catch {
    native = null;
  }
}

export function authenticate() {
  native?.authenticate();
}
export function submitScore(leaderboardId, score) {
  native?.submitScore(leaderboardId, score);
}
export function showLeaderboard(leaderboardId) {
  native?.showLeaderboard(leaderboardId);
}
