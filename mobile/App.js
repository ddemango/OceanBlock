import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import gameHtml from './game-html';

// The whole game is bundled as one offline HTML page and run full-screen in a WebView.
export default function App() {
  const onMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'haptic') {
        Haptics.impactAsync(
          msg.strength === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
        );
      }
    } catch {
      /* ignore malformed messages */
    }
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <WebView
        source={{ html: gameHtml, baseUrl: 'https://tidebreaker.app/' }}
        originWhitelist={['*']}
        style={styles.web}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
        setSupportMultipleWindows={false}
        textInteractionEnabled={false}
        allowsLinkPreview={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8fd7ee' },
  web: { flex: 1, backgroundColor: '#8fd7ee' },
});
