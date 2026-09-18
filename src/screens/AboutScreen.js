import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import SafeScreen from "../components/SafeScreen";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

export default function AboutScreen() {
  return (
    <SafeScreen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
  source={require("../../assets/Wearly-logo.png")}
  style={styles.logo}
  resizeMode="contain"
/>

<Text style={styles.title}>
  Wearly
</Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <Text style={styles.bodyText}>
            Wearly is a personal
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
          Wearly • Version 1.0.0
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

 logo: {
  width: 150,
  height: 150,
  marginBottom: 10,
},

 title: {
  fontFamily: typography.extraBold,
  fontSize: 30,
  letterSpacing: -0.8,
  color: colors.text,
},

  version: {
  marginTop: 4,
  fontFamily: typography.medium,
  fontSize: 12,
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
  fontFamily: typography.bold,
  fontSize: 16,
  color: colors.text,
},

  bodyText: {
  marginBottom: 12,
  fontFamily: typography.regular,
  fontSize: 13,
  lineHeight: 21,
  color: colors.secondaryText,
},

  featureRow: {
    paddingVertical: 4,
  },

  featureTitle: {
  fontFamily: typography.semibold,
  fontSize: 14,
  color: colors.text,
},

  featureText: {
  marginTop: 5,
  fontFamily: typography.regular,
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
  fontFamily: typography.medium,
  fontSize: 11,
  color: colors.secondaryText,
},
});