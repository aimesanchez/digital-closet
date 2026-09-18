import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ClosetScreen from "../screens/ClosetScreen";
import CreateOutfitScreen from "../screens/CreateOutfitScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused
              ? "home"
              : "home-outline";
          }

          if (route.name === "Closet") {
            iconName = focused
              ? "shirt"
              : "shirt-outline";
          }

          if (route.name === "Create Outfit") {
            iconName = focused
              ? "color-wand"
              : "color-wand-outline";
          }

          if (route.name === "Profile") {
            iconName = focused
              ? "person"
              : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: "#1C1C1E",
        tabBarInactiveTintColor: "#9A9A9E",

        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEF0",
          elevation: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },

        tabBarIconStyle: {
          marginBottom: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Closet"
        component={ClosetScreen}
      />

      <Tab.Screen
        name="Create Outfit"
        component={CreateOutfitScreen}
        options={{
          tabBarLabel: "Create",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}