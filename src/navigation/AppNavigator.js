import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import AddItemScreen from "../screens/AddItemScreen";
import OutfitBuilderScreen from "../screens/OutfitBuilderScreen";
import PersonalInformationScreen from "../screens/PersonalInformationScreen";
import ClothingCareScreen from "../screens/ClothingCareScreen";
import AboutScreen from "../screens/AboutScreen";

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
      name="PersonalInformation"
      component={PersonalInformationScreen}
      />
      <Stack.Screen
      name="OutfitBuilder"
      component={OutfitBuilderScreen}
      />

      <Stack.Screen
      name="ClothingCare"
      component={ClothingCareScreen}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        />
    </Stack.Navigator>
  );
}