import { NavigationContainer } from "@react-navigation/native";

import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { ClosetProvider } from "./src/context/ClosetContext";

export default function App() {
  return (
    <NavigationContainer>
      <ClosetProvider>
        <MainTabNavigator />
      </ClosetProvider>
    </NavigationContainer>
  );
}