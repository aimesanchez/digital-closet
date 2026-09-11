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
import { colors } from "../constants/colors";
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

      icon: "☔",

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

      icon: "🧥",

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

      icon: "☀️",

      title: "Dress light",

      message:
        "It's going to be hot. Lightweight and breathable clothing may keep you more comfortable.",
    });
  }

  /* HIGH UV */

  if (weather.uvIndex >= 6) {
    recommendations.push({
      id: "uv",

      icon: "🕶️",

      title: "High UV",

      message:
        `UV index is ${weather.uvIndex}. Consider sunglasses, a hat, and sun protection.`,
    });
  }

  /* WIND */

  if (weather.windSpeed >= 15) {
    recommendations.push({
      id: "wind",

      icon: "💨",

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

      icon: "🌙",

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
          <Text style={styles.weatherLabel}>
            TODAY'S WEATHER
          </Text>

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

      {/* WEATHER ALERTS */}

      {weatherRecommendations.length >
        0 && (
        <View
          style={
            styles.weatherAlertsContainer
          }
        >
          {weatherRecommendations
            .slice(0, 2)
            .map(
              (recommendation) => (
                <View
                  key={
                    recommendation.id
                  }
                  style={
                    styles.rainAlert
                  }
                >
                  <Text
                    style={
                      styles.rainAlertIcon
                    }
                  >
                    {
                      recommendation.icon
                    }
                  </Text>

                  <View
                    style={
                      styles.rainAlertTextContainer
                    }
                  >
                    <Text
                      style={
                        styles.rainAlertTitle
                      }
                    >
                      {
                        recommendation.title
                      }
                    </Text>

                    <Text
                      style={
                        styles.rainAlertText
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
    </>

  ) : null}
</View>

        {/* WEATHER QUESTION */}

        <View style={styles.section}>
          <Text
            style={
              styles.questionNumber
            }
          >
            Weather
          </Text>

          <Text
            style={
              styles.questionTitle
            }
          >
            What weather are you
            dressing for?
          </Text>

          <Text
            style={
              styles.questionDescription
            }
          >
            We've selected today's
            weather automatically, but
            you can change it if you're
            planning ahead.
          </Text>

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
          <Text
            style={
              styles.questionNumber
            }
          >
            Occasion
          </Text>

          <Text
            style={
              styles.questionTitle
            }
          >
            What are you dressing for?
          </Text>

          <Text
            style={
              styles.questionDescription
            }
          >
            Choose one or more occasions.
            We'll use them to help filter
            your closet while you build
            your outfit.
          </Text>

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
          <Text
            style={
              styles.reminderIcon
            }
          >
            {recommendation.icon}
          </Text>

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
          <Text
            style={
              styles.buildButtonText
            }
          >
            Build My Outfit
          </Text>
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
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,

    color:
      colors.secondaryText,

    marginTop: 6,

    lineHeight: 21,
  },
  weatherAlertsContainer: {
  marginTop: 18,
  gap: 10,
},

reminderSubtitle: {
  fontSize: 13,

  lineHeight: 19,

  color:
    colors.secondaryText,

  marginTop: 5,

  marginBottom: 6,
},

reminderItem: {
  flexDirection: "row",

  alignItems: "flex-start",

  marginTop: 14,
},

reminderIcon: {
  fontSize: 22,

  marginRight: 12,
},

reminderItemText: {
  flex: 1,
},

reminderItemTitle: {
  fontSize: 14,

  fontWeight: "700",

  color: colors.text,

  marginBottom: 3,
},

  /* WEATHER */

  weatherCard: {
    marginTop: 26,

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius: 26,

    padding: 20,
  },

  weatherTopRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent:
      "space-between",
  },

  weatherLabel: {
    fontSize: 12,

    fontWeight: "700",

    color:
      colors.secondaryText,

    letterSpacing: 0.8,
  },

  temperature: {
    fontSize: 38,

    fontWeight: "700",

    color: colors.text,

    marginTop: 4,
  },

  weatherCategoryBadge: {
    backgroundColor:
      colors.background,

    borderWidth: 1,

    borderColor:
      colors.border,

    borderRadius: 18,

    paddingHorizontal: 14,

    paddingVertical: 8,
  },

  weatherCategoryText: {
    fontSize: 13,

    fontWeight: "700",

    color: colors.text,
  },

  weatherCondition: {
    marginTop: 4,

    fontSize: 15,

    color:
      colors.secondaryText,
  },

  rainAlert: {
    flexDirection: "row",

    marginTop: 18,

    padding: 14,

    borderRadius: 18,

    backgroundColor:
      colors.background,
  },

  rainAlertIcon: {
    fontSize: 24,

    marginRight: 12,
  },

  rainAlertTextContainer: {
    flex: 1,
  },

  rainAlertTitle: {
    fontSize: 14,

    fontWeight: "700",

    color: colors.text,
  },

  rainAlertText: {
    fontSize: 13,

    lineHeight: 18,

    color:
      colors.secondaryText,

    marginTop: 3,
  },

  /* QUESTIONS */

  section: {
    marginTop: 24,

    backgroundColor:
      colors.surface,

    borderWidth: 1,

    borderColor:
      colors.border,

    borderRadius: 26,

    padding: 20,
  },

  questionNumber: {
    fontSize: 12,

    fontWeight: "700",

    color: colors.accent,

    textTransform:
      "uppercase",

    letterSpacing: 0.8,

    marginBottom: 7,
  },

  questionTitle: {
    fontSize: 22,

    fontWeight: "700",

    color: colors.text,
  },

  questionDescription: {
    fontSize: 14,

    lineHeight: 20,

    color:
      colors.secondaryText,

    marginTop: 7,
  },

  optionContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 10,

    marginTop: 22,
  },

  optionButton: {
    backgroundColor:
      colors.background,

    borderWidth: 1,

    borderColor:
      colors.border,

    borderRadius: 20,

    paddingHorizontal: 16,

    paddingVertical: 12,
  },

  optionButtonSelected: {
    backgroundColor:
      colors.accent,

    borderColor:
      colors.accent,
  },

  optionText: {
    color: colors.text,

    fontSize: 14,

    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  /* SUMMARY */

  selectionSummary: {
    marginTop: 20,

    paddingHorizontal: 4,
  },

  selectionLabel: {
    color:
      colors.secondaryText,

    fontSize: 12,

    marginBottom: 5,
  },

  selectionText: {
    color: colors.text,

    fontSize: 14,

    fontWeight: "600",
  },

  /* REMINDER */

  reminderCard: {
    marginTop: 20,

    backgroundColor:
      colors.surface,

    borderWidth: 1,

    borderColor:
      colors.border,

    borderRadius: 22,

    padding: 18,
  },

  reminderTitle: {
    fontSize: 16,

    fontWeight: "700",

    color: colors.text,
  },

  reminderText: {
    fontSize: 14,

    lineHeight: 20,

    color:
      colors.secondaryText,

    marginTop: 7,
  },

  /* BUTTON */

  buildButton: {
    backgroundColor:
      colors.accent,

    borderRadius: 22,

    paddingVertical: 17,

    alignItems: "center",

    marginTop: 28,
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