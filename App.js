import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  StatusBar,
} from "expo-status-bar";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import AppNavigator from "./src/navigation/AppNavigator";

import {
  ClosetProvider,
} from "./src/context/ClosetContext";

import {
  WeatherProvider,
} from "./src/context/WeatherContext";

import {
  ProfileProvider,
} from "./src/context/ProfileContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      <NavigationContainer>
        <ClosetProvider>
          <WeatherProvider>
            <ProfileProvider>
              <AppNavigator />
            </ProfileProvider>
          </WeatherProvider>
        </ClosetProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}