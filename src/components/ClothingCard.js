import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export default function ClothingCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>Photo</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 16,
  },

  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  placeholderText: {
    color: colors.secondaryText,
    fontSize: 13,
  },

  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  category: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 2,
  },
});