import { View, Text, StyleSheet } from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

export default function CreateOutfitScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Create Outfit</Text>
        <Text style={styles.subtitle}>
          Choose items from your closet to build an outfit.
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
  },
});