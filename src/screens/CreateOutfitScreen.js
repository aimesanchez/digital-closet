import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { useCloset } from "../context/ClosetContext";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import SafeScreen from "../components/SafeScreen";
import { useWeather, } from"../context/WeatherContext";

const DEFAULT_OCCASIONS = [
  "Casual",
  "School / Work",
  "Formal",
  "Active / Gym",
  "Date Night",
];

/*
 * TEMPORARY WEATHER DATA
 *
 * Later, these values will come from
 * our shared WeatherContext.
 */

function getWeatherRecommendations(weather) {
  const recommendations = [];

  /* RAIN */

  if (weather.rainExpected) {
    recommendations.push({
      id: "rain",

      icon: "umbrella-outline",

      title: "Rain expected",

      message:
        `${weather.rainChance}% chance of rain today. ` +
        "Consider bringing an umbrella and wearing a raincoat or rain boots.",
    });
  }

  /* COLD */

  if (
    weather.temperature <= 50 ||
    weather.weatherCategory === "Cold"
  ) {
    recommendations.push({
      id: "cold",

      icon: "snow-outline",

      title: "Bundle up",

      message:
        "It's cold outside. A coat, sweater, or warm layer would be a good addition.",
    });
  }

  /* HOT */

  if (
    weather.temperature >= 85 ||
    weather.weatherCategory === "Hot"
  ) {
    recommendations.push({
      id: "hot",

      icon: "sunny-outline",

      title: "Dress light",

      message:
        "It's going to be hot. Lightweight and breathable clothing may keep you more comfortable.",
    });
  }

  /* HIGH UV */

  if (weather.uvIndex >= 6) {
    recommendations.push({
      id: "uv",

      icon: "sunny",

      title: "High UV",

      message:
        `UV index is ${weather.uvIndex}. Consider sunglasses, a hat, and sun protection.`,
    });
  }

  /* WIND */

  if (weather.windSpeed >= 15) {
    recommendations.push({
      id: "wind",

      icon: "leaf-outline",

      title: "It's windy",

      message:
        `Winds may reach around ${weather.windSpeed} mph. A light jacket or secure outer layer could help.`,
    });
  }

  /* TEMPERATURE DROP */

  if (
    weather.temperature -
      weather.eveningTemperature >=
    10
  ) {
    recommendations.push({
      id: "temperature-drop",

      icon: "moon-outline",

      title: "It gets cooler later",

      message:
        `Temperatures may fall to around ${weather.eveningTemperature}°F this evening. Consider bringing an extra layer.`,
    });
  }

  return recommendations;
}

export default function CreateOutfitScreen({
  navigation,
}) {
  const { clothingItems } = useCloset();
  const { 
    currentWeather,
    weatherLoading,
    weatherError,
  } = useWeather();

  const weatherRecommendations = 
  currentWeather
    ? getWeatherRecommendations(
      currentWeather
    )
    : [];

  const [
    selectedOccasions,
    setSelectedOccasions,
  ] = useState([]);

  const [
    selectedWeather,
    setSelectedWeather,
  ] = useState(null);

  useEffect(() => {
  if (
    currentWeather &&
    !selectedWeather
  ) {
    setSelectedWeather(
      currentWeather.weatherCategory
    );
  }
}, [
  currentWeather,
  selectedWeather,
]);

  /* -------------------------------- */
  /* OCCASION OPTIONS                 */
  /* -------------------------------- */

  const occasionOptions = useMemo(() => {
    const closetOccasions =
      clothingItems.flatMap(
        (item) =>
          item.occasions || []
      );

    return [
      ...new Set([
        ...DEFAULT_OCCASIONS,
        ...closetOccasions,
      ]),
    ];
  }, [clothingItems]);

  /* -------------------------------- */
  /* SELECT / UNSELECT OCCASION       */
  /* -------------------------------- */

  const toggleOccasion = (
    occasion
  ) => {
    setSelectedOccasions(
      (currentOccasions) =>
        currentOccasions.includes(
          occasion
        )
          ? currentOccasions.filter(
              (item) =>
                item !== occasion
            )
          : [
              ...currentOccasions,
              occasion,
            ]
    );
  };

  /* -------------------------------- */
  /* OPEN CANVAS                      */
  /* -------------------------------- */

  const buildOutfit = () => {
    navigation.navigate(
      "OutfitBuilder",
      {
        selectedOccasions,
        selectedWeather,
      }
    );
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <Text style={styles.title}>
          Create an Outfit
        </Text>

        <Text style={styles.subtitle}>
          Build a look that works for
          your plans and today's weather.
        </Text>
{/* WEATHER CARD */}

<View style={styles.weatherCard}>
  {/* LOADING */}

  {weatherLoading ? (
    <Text style={styles.temperature}>
      Loading weather...
    </Text>

  ) : weatherError ? (

    /* ERROR */

    <Text style={styles.weatherCondition}>
      {weatherError}
    </Text>

  ) : currentWeather ? (

    /* REAL WEATHER */

    <>
      <View style={styles.weatherTopRow}>
        <View>
          <View style={styles.weatherLabelRow}>
            <Ionicons
            name="location-outline"
            size={14}
            color="rgba(255,255,255,0.72)"
            />

            <Text style={styles.weatherLabel}>
              TODAY
            </Text>
          </View>

          <Text style={styles.temperature}>
            {currentWeather.temperature}°F
          </Text>
        </View>

        <View
          style={
            styles.weatherCategoryBadge
          }
        >
          <Text
            style={
              styles.weatherCategoryText
            }
          >
            {currentWeather.weatherCategory}
          </Text>
        </View>
      </View>

      <Text
        style={styles.weatherCondition}
      >
        {currentWeather.condition}
        {" • Feels like "}
        {currentWeather.feelsLike}°F
      </Text>

    </>

  ) : null}
</View>

        {/* WEATHER QUESTION */}

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
              <View style={styles.sectionIcon}>
                <Ionicons
                name="partly-sunny-outline"
                size={19}
                color={colors.accent}
              />
            </View>

  <View style={styles.sectionHeadingText}>
    <Text style={styles.questionTitle}>
      Weather
    </Text>

    <Text style={styles.questionDescription}>
      Today's forecast is selected automatically.
    </Text>
  </View>
</View>

          <View
            style={
              styles.optionContainer
            }
          >
            {[
              "Hot",
              "Warm",
              "Cool",
              "Cold",
            ].map(
              (weatherOption) => {
                const selected =
                  selectedWeather ===
                  weatherOption;

                return (
                  <Pressable
                    key={weatherOption}
                    style={[
                      styles.optionButton,

                      selected &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() =>
                      setSelectedWeather(
                        weatherOption
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,

                        selected &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {weatherOption}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        </View>

        {/* OCCASION QUESTION */}

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
  <View style={styles.sectionIcon}>
    <Ionicons
      name="sparkles-outline"
      size={19}
      color={colors.accent}
    />
  </View>

  <View style={styles.sectionHeadingText}>
    <Text style={styles.questionTitle}>
      Occasion
    </Text>

    <Text style={styles.questionDescription}>
      Pick one or more.
    </Text>
  </View>
</View>

          <View
            style={
              styles.optionContainer
            }
          >
            {occasionOptions.map(
              (occasion) => {
                const selected =
                  selectedOccasions.includes(
                    occasion
                  );

                return (
                  <Pressable
                    key={occasion}
                    style={[
                      styles.optionButton,

                      selected &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() =>
                      toggleOccasion(
                        occasion
                      )
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
              }
            )}
          </View>
        </View>

        {/* SELECTION SUMMARY */}

        {selectedOccasions.length >
          0 && (
          <View
            style={
              styles.selectionSummary
            }
          >
            <Text
              style={
                styles.selectionLabel
              }
            >
              Building for
            </Text>

            <Text
              style={
                styles.selectionText
              }
            >
              {selectedWeather}
              {" • "}
              {selectedOccasions.join(
                " • "
              )}
            </Text>
          </View>
        )}

        {/* WEATHER REMINDER */}

       {weatherRecommendations.length >
  0 && (
  <View
    style={
      styles.reminderCard
    }
  >
    <Text
      style={
        styles.reminderTitle
      }
    >
      Before you head out
    </Text>

    <Text
      style={
        styles.reminderSubtitle
      }
    >
      A few things to keep in mind
      for today's weather:
    </Text>

    {weatherRecommendations.map(
      (recommendation) => (
        <View
          key={recommendation.id}
          style={
            styles.reminderItem
          }
        >
          <View style={styles.reminderIconContainer}>
            <Ionicons
              name={recommendation.icon}
              size={20}
              color={colors.accent}
            />
        </View>

          <View
            style={
              styles.reminderItemText
            }
          >
            <Text
              style={
                styles.reminderItemTitle
              }
            >
              {
                recommendation.title
              }
            </Text>

            <Text
              style={
                styles.reminderText
              }
            >
              {
                recommendation.message
              }
            </Text>
          </View>
        </View>
      )
    )}
  </View>
)}

        {/* BUILD BUTTON */}

        <Pressable
          style={[
            styles.buildButton,

            selectedOccasions.length ===
              0 &&
              styles.buildButtonDisabled,
          ]}
          disabled={
            selectedOccasions.length ===
            0
          }
          onPress={buildOutfit}
        >
          <View style={styles.buildButtonContent}>
  <Text style={styles.buildButtonText}>
    Build My Outfit
  </Text>

  <Ionicons
    name="arrow-forward"
    size={20}
    color="#FFFFFF"
  />
</View>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

/* -------------------------------- */
/* STYLES                           */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },

  /* HEADER */

  title: {
    fontFamily: typography.extraBold,
    fontSize: 34,
    letterSpacing: -1.2,
    color: colors.text,
  },

  subtitle: {
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
    marginTop: 5,
    maxWidth: 320,
  },

  /* WEATHER HERO */

  weatherCard: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 22,
  },

  weatherTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  weatherLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  weatherLabel: {
    fontFamily: typography.bold,
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 1.2,
  },

  temperature: {
    fontFamily: typography.extraBold,
    fontSize: 52,
    letterSpacing: -2,
    color: "#FFFFFF",
    marginTop: 8,
  },

  weatherCategoryBadge: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  weatherCategoryText: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: "#FFFFFF",
  },

  weatherCondition: {
    fontFamily: typography.medium,
    marginTop: 3,
    fontSize: 14,
    color: "rgba(255,255,255,0.76)",
  },

  /* SECTIONS */

  section: {
    marginTop: 30,
  },

  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sectionHeadingText: {
    flex: 1,
  },

  questionNumber: {
    fontFamily: typography.bold,
    fontSize: 11,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  questionTitle: {
    fontFamily: typography.bold,
    fontSize: 20,
    letterSpacing: -0.4,
    color: colors.text,
  },

  questionDescription: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondaryText,
    marginTop: 2,
  },

  /* OPTIONS */

  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },

  optionButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionText: {
    fontFamily: typography.semibold,
    color: colors.text,
    fontSize: 14,
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  /* SUMMARY */

  selectionSummary: {
    marginTop: 22,
    backgroundColor: colors.accentLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  selectionLabel: {
    fontFamily: typography.bold,
    color: colors.accent,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  selectionText: {
    fontFamily: typography.semibold,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
  },

  /* REMINDERS */

  reminderCard: {
    marginTop: 32,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
  },

  reminderTitle: {
    fontFamily: typography.bold,
    fontSize: 19,
    letterSpacing: -0.3,
    color: colors.text,
  },

  reminderSubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    marginTop: 4,
    marginBottom: 4,
  },

  reminderItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18,
  },

  reminderIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  reminderItemText: {
    flex: 1,
  },

  reminderItemTitle: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 3,
  },

  reminderText: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
  },

  /* BUILD BUTTON */

  buildButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 20,
    marginTop: 28,
  },

  buildButtonDisabled: {
    opacity: 0.35,
  },

  buildButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  buildButtonText: {
    fontFamily: typography.bold,
    color: "#FFFFFF",
    fontSize: 16,
  },
});