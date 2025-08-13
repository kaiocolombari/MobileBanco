import { Stack } from 'expo-router';
import { useFontsApp } from '../types/types.font';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  const fontsLoaded = useFontsApp();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {!fontsLoaded ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1B98E0" />
            <Text style={styles.loadingText}>Carregando fontes...</Text>
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
