import { ToastProvider } from "@/providers/ToastProvider";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
  useFonts,
} from "@expo-google-fonts/josefin-sans";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import MainProvider from "@/providers/MainProvider";

export default function RootLayout() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    regular: JosefinSans_400Regular,
    medium: JosefinSans_500Medium,
    "semi-bold": JosefinSans_600SemiBold,
    bold: JosefinSans_700Bold,
  });

  const loadResources = useCallback(async () => {
    try {
      const savedFavourites = await SecureStore.getItemAsync("favourites");
      if (savedFavourites) {
        setFavourites(JSON.parse(savedFavourites));
      }
    } catch (e) {
      console.warn("Failed to load favourites:", e);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  useEffect(() => {
    if (fontsLoaded && ready) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, ready]);

  if (!fontsLoaded || !ready) {
    return null; // Prevent rendering until fonts are ready
  }
  return (
    <ToastProvider>
      <MainProvider favourites={favourites} setFavourites={setFavourites}>
        <View style={{ backgroundColor: "#3b80e0ff", flex: 1 }}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#3b80e0ff" }}>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
      </MainProvider>
    </ToastProvider>
  );
}
