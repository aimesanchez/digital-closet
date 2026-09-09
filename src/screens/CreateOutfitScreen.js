import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { useCloset } from "../context/ClosetContext";
import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

const DEFAULT_OCCASIONS = [
  "Casual",
  "School / Work",
  "Formal",
  "Active / Gym",
  "Date Night",
];

export default function CreateOutfitScreen() {
  const { clothingItems } = useCloset();

  const [selectedOccasion, setSelectedOccasion] =
    useState("");

  const [startingPieces, setStartingPieces] =
    useState(null);

  const occasionOptions = useMemo(() => {
    const customOccasions = clothingItems
      .flatMap((item) => item.occasions || [])
      .filter(
        (occasion) =>
          !DEFAULT_OCCASIONS.includes(occasion)
      );

    return [
      ...DEFAULT_OCCASIONS,
      ...new Set(customOccasions),
      "Other",
    ];
  }, [clothingItems]);

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Create Outfit
        </Text>

        <Text style={styles.subtitle}>
          Tell us a little about your day and we'll
          narrow down your closet.
        </Text>

        {/* WEATHER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Today's Weather
          </Text>

          <View style={styles.weatherCard}>
            <Text style={styles.weatherTemperature}>
              80°F
            </Text>

            <Text style={styles.weatherSummary}>
              Sunny and warm
            </Text>

            <Text style={styles.weatherNote}>
              Weather will be connected automatically
              soon.
            </Text>
          </View>
        </View>

        {/* OCCASION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What are you dressing for?
          </Text>

          <Text style={styles.sectionSubtitle}>
            What's the occasion?
          </Text>

          <View style={styles.optionRow}>
            {occasionOptions.map((occasion) => {
              const selected =
                selectedOccasion === occasion;

              return (
                <Pressable
                  key={occasion}
                  style={[
                    styles.optionButton,
                    selected &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() =>
                    setSelectedOccasion(occasion)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {occasion}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* STARTING PIECES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How many pieces do you want to start with?
          </Text>

          <Text style={styles.sectionSubtitle}>
            You can always add or remove pieces later.
          </Text>

          <View style={styles.pieceRow}>
            {[2, 3, 4].map((number) => {
              const selected =
                startingPieces === number;

              return (
                <Pressable
                  key={number}
                  style={[
                    styles.pieceButton,
                    selected &&
                      styles.pieceButtonSelected,
                  ]}
                  onPress={() =>
                    setStartingPieces(number)
                  }
                >
                  <Text
                    style={[
                      styles.pieceNumber,
                      selected &&
                        styles.pieceTextSelected,
                    ]}
                  >
                    {number}
                  </Text>

                  <Text
                    style={[
                      styles.pieceLabel,
                      selected &&
                        styles.pieceTextSelected,
                    ]}
                  >
                    {number === 2
                      ? "Dress"
                      : number === 3
                      ? "Classic"
                      : "Layered"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {startingPieces === 2 && (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Your outfit will start with a Dress
                and Shoes.
              </Text>
            </View>
          )}

          {startingPieces === 3 && (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Your outfit will start with a Top,
                Bottom, and Shoes.
              </Text>
            </View>
          )}

          {startingPieces === 4 && (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Your outfit will start with a Top,
                Bottom, Shoes, and one extra piece.
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.buildButton,
            (!selectedOccasion ||
              !startingPieces) &&
              styles.buildButtonDisabled,
          ]}
          disabled={
            !selectedOccasion || !startingPieces
          }
          onPress={() => {
            console.log({
              selectedOccasion,
              startingPieces,
            });
          }}
        >
          <Text style={styles.buildButtonText}>
            Build My Outfit
          </Text>
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 21,
    marginBottom: 28,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 14,
  },

  weatherCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 20,
    marginTop: 10,
  },

  weatherTemperature: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
  },

  weatherSummary: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
  },

  weatherNote: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 10,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 20,
  },

  optionButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionText: {
    color: colors.text,
    fontWeight: "500",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  pieceRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  pieceButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },

  pieceButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  pieceNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },

  pieceLabel: {
    fontSize: 12,
    marginTop: 4,
    color: colors.secondaryText,
  },

  pieceTextSelected: {
    color: "#FFFFFF",
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoText: {
    color: colors.secondaryText,
    fontSize: 13,
    textAlign: "center",
  },

  buildButton: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
  },

  buildButtonDisabled: {
    opacity: 0.4,
  },

  buildButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});