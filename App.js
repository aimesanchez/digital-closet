import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { ClosetProvider } from "./src/context/ClosetContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      
      <NavigationContainer>
        <ClosetProvider>
          <AppNavigator/>
        </ClosetProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}