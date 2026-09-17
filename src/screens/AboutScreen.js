import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SafeScreen from "../components/SafeScreen";
import { colors } from "../constants/colors";

export default function AboutScreen() {
  return (
    <SafeScreen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>
              DC
            </Text>
          </View>

          <Text style={styles.title}>
            Digital Closet
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <Text style={styles.bodyText}>
            Digital Closet is a personal
            wardrobe management app designed
            to make organizing clothes and
            creating outfits easier.
          </Text>

          <Text style={styles.bodyText}>
            Add clothing to your digital
            closet, build and save outfits,
            get weather-aware outfit
            suggestions, and keep track of
            material-based clothing care
            guidance all in one place.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Features
          </Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>
              Digital Wardrobe
            </Text>

            <Text style={styles.featureText}>
              Organize clothing with
              categories, colors, occasions,
              and weather preferences.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>
              Outfit Builder
            </Text>

            <Text style={styles.featureText}>
              Create outfits using an
              interactive canvas and save
              them to your wardrobe.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>
              Weather-Aware Suggestions
            </Text>

            <Text style={styles.featureText}>
              Use local weather conditions
              to help narrow down clothing
              and outfit choices.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureTitle}>
              Clothing Care
            </Text>

            <Text style={styles.featureText}>
              Save material composition and
              view material-based care
              guidance for items in your
              closet.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Built With
          </Text>

          <Text style={styles.bodyText}>
            React Native + Expo
          </Text>
        </View>

        <Text style={styles.footer}>
          Digital Closet • Version 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoPlaceholder: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  logoText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
  },

  version: {
    marginTop: 5,
    fontSize: 13,
    color: colors.secondaryText,
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  bodyText: {
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 21,
    color: colors.secondaryText,
  },

  featureRow: {
    paddingVertical: 4,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  featureText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 11,
    color: colors.secondaryText,
  },
});