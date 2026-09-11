import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import AddItemScreen from "../screens/AddItemScreen";
import OutfitBuilderScreen from "../screens/OutfitBuilderScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
      />

      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
      />
      <Stack.Screen
      name="OutfitBuilder"
      component={OutfitBuilderScreen}
      />
    </Stack.Navigator>
  );
}