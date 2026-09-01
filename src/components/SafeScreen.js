import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import { colors } from "../constants/colors";

export default function SafeScreen({ children }) {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});