import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import ClosetScreen from "../screens/ClosetScreen";
import CreateOutfitScreen from "../screens/CreateOutfitScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
            <Tab.Navigator
             screenOptions={{
             headerShown: false,
            }}
            >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Closet" component={ClosetScreen} />
            <Tab.Screen name="Create Outfit" component={CreateOutfitScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}