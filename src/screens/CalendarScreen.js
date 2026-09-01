import { View, Text, StyleSheet } from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

export default function CalendarScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.text}>Calendar Screen</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  text: {
    color: colors.text,
  },
});