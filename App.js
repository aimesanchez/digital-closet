import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  StatusBar,
} from "expo-status-bar";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

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