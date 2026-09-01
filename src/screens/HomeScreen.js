import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

export default function HomeScreen() {
  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Aime</Text>
          </View>

          <Pressable style={styles.profileButton}>
            <Text style={styles.profileInitial}>A</Text>
          </Pressable>
        </View>

        {/* Weather */}
        <View style={styles.weatherCard}>
          <View>
            <Text style={styles.sectionLabel}>TODAY'S WEATHER</Text>
            <Text style={styles.temperature}>80°F</Text>
            <Text style={styles.weatherDescription}>
              Sunny and warm
            </Text>
          </View>

          <Text style={styles.weatherIcon}>☀️</Text>
        </View>

        {/* Today's Outfit */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Outfit</Text>

          <Pressable>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.outfitCard}>
          <View style={styles.clothingPlaceholder}>
            <Text style={styles.placeholderText}>Top</Text>
          </View>

          <View style={styles.clothingPlaceholder}>
            <Text style={styles.placeholderText}>Bottom</Text>
          </View>

          <View style={styles.clothingPlaceholder}>
            <Text style={styles.placeholderText}>Shoes</Text>
          </View>
        </View>

        {/* Suggested Accessories */}
        <Text style={styles.sectionTitle}>
          Suggested Accessories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.accessoriesContainer}
        >
          <View style={styles.accessoryCard}>
            <Text style={styles.accessoryEmoji}>🕶️</Text>
            <Text style={styles.accessoryName}>Sunglasses</Text>
          </View>

          <View style={styles.accessoryCard}>
            <Text style={styles.accessoryEmoji}>👜</Text>
            <Text style={styles.accessoryName}>Bag</Text>
          </View>

          <View style={styles.accessoryCard}>
            <Text style={styles.accessoryEmoji}>🧢</Text>
            <Text style={styles.accessoryName}>Hat</Text>
          </View>
        </ScrollView>

        {/* Closet */}
        <Pressable style={styles.closetButton}>
          <View>
            <Text style={styles.closetButtonText}>My Closet</Text>

            <Text style={styles.closetButtonSubtext}>
              Browse your wardrobe
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 15,
    color: colors.secondaryText,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
  },

  weatherCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.secondaryText,
    marginBottom: 5,
  },

  temperature: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.text,
  },

  weatherDescription: {
    marginTop: 4,
    fontSize: 15,
    color: colors.secondaryText,
  },

  weatherIcon: {
    fontSize: 48,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },

  editText: {
    color: colors.accent,
    fontWeight: "600",
    marginBottom: 14,
  },

  outfitCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },

  clothingPlaceholder: {
    height: 75,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  placeholderText: {
    color: colors.secondaryText,
    fontWeight: "500",
  },

  accessoriesContainer: {
    marginBottom: 28,
  },

  accessoryCard: {
    width: 105,
    height: 105,
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  accessoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  accessoryName: {
    fontSize: 13,
    color: colors.text,
  },

  closetButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closetButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  closetButtonSubtext: {
    color: "#F5EDE9",
    fontSize: 13,
    marginTop: 3,
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 32,
  },
});