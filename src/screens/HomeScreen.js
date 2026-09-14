import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import { useWeather } from "../context/WeatherContext";

export default function HomeScreen() {
  const {
    currentWeather,
    weatherLoading,
    weatherError,
  } = useWeather();

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
            <Text style={styles.greeting}>
              Good morning
            </Text>

            <Text style={styles.name}>
              Aime
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
          >
            <Text
              style={
                styles.profileInitial
              }
            >
              A
            </Text>
          </Pressable>
        </View>

        {/* WEATHER */}

        <View style={styles.weatherCard}>
          {weatherLoading ? (
            <Text
              style={
                styles.weatherStatusText
              }
            >
              Loading weather...
            </Text>
          ) : weatherError ? (
            <Text
              style={
                styles.weatherStatusText
              }
            >
              {weatherError}
            </Text>
          ) : currentWeather ? (
            <>
              <View
                style={
                  styles.weatherTopRow
                }
              >
                <View>
                  <Text
                    style={
                      styles.sectionLabel
                    }
                  >
                    TODAY'S WEATHER
                  </Text>

                  <Text
                    style={
                      styles.temperature
                    }
                  >
                    {
                      currentWeather.temperature
                    }
                    °F
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
                    {
                      currentWeather.weatherCategory
                    }
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.weatherDescription
                }
              >
                {currentWeather.condition}
                {" • Feels like "}
                {currentWeather.feelsLike}
                °F
              </Text>

              {currentWeather.rainExpected && (
                <View
                  style={
                    styles.weatherNotice
                  }
                >
                  <Text
                    style={
                      styles.weatherNoticeTitle
                    }
                  >
                    Rain expected later
                  </Text>

                  <Text
                    style={
                      styles.weatherNoticeText
                    }
                  >
                    {
                      currentWeather.rainChance
                    }
                    % chance of rain today.
                    Consider bringing an
                    umbrella or rain layer.
                  </Text>
                </View>
              )}
            </>
          ) : null}
        </View>

        {/* TODAY'S OUTFIT */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Outfit
          </Text>

          <Pressable>
            <Text style={styles.editText}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={styles.outfitCard}>
          <View
            style={
              styles.clothingPlaceholder
            }
          >
            <Text
              style={
                styles.placeholderText
              }
            >
              Top
            </Text>
          </View>

          <View
            style={
              styles.clothingPlaceholder
            }
          >
            <Text
              style={
                styles.placeholderText
              }
            >
              Bottom
            </Text>
          </View>

          <View
            style={
              styles.clothingPlaceholder
            }
          >
            <Text
              style={
                styles.placeholderText
              }
            >
              Shoes
            </Text>
          </View>
        </View>

        {/* SUGGESTED ACCESSORIES */}

        <Text style={styles.sectionTitle}>
          Suggested Accessories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={
            styles.accessoriesContainer
          }
        >
          <View
            style={
              styles.accessoryCard
            }
          >
            <Text
              style={
                styles.accessoryEmoji
              }
            >
              🕶️
            </Text>

            <Text
              style={
                styles.accessoryName
              }
            >
              Sunglasses
            </Text>
          </View>

          <View
            style={
              styles.accessoryCard
            }
          >
            <Text
              style={
                styles.accessoryEmoji
              }
            >
              👜
            </Text>

            <Text
              style={
                styles.accessoryName
              }
            >
              Bag
            </Text>
          </View>

          <View
            style={
              styles.accessoryCard
            }
          >
            <Text
              style={
                styles.accessoryEmoji
              }
            >
              🧢
            </Text>

            <Text
              style={
                styles.accessoryName
              }
            >
              Hat
            </Text>
          </View>
        </ScrollView>

        {/* CLOSET */}

        <Pressable
          style={styles.closetButton}
        >
          <View>
            <Text
              style={
                styles.closetButtonText
              }
            >
              My Closet
            </Text>

            <Text
              style={
                styles.closetButtonSubtext
              }
            >
              Browse your wardrobe
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 15,
    color:
      colors.secondaryText,
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

    backgroundColor:
      colors.accentLight,

    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
  },

  /* WEATHER */

  weatherCard: {
    backgroundColor:
      colors.accentLight,

    borderRadius: 22,

    padding: 20,

    marginBottom: 28,
  },

  weatherTopRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "flex-start",
  },

  sectionLabel: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 1,

    color:
      colors.secondaryText,

    marginBottom: 5,
  },

  temperature: {
    fontSize: 36,

    fontWeight: "700",

    color: colors.text,
  },

  weatherDescription: {
    marginTop: 6,

    fontSize: 15,

    color:
      colors.secondaryText,
  },

  weatherCategoryBadge: {
    backgroundColor:
      colors.surface,

    borderRadius: 18,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderWidth: 1,

    borderColor:
      colors.border,
  },

  weatherCategoryText: {
    fontSize: 13,

    fontWeight: "700",

    color: colors.text,
  },

  weatherStatusText: {
    fontSize: 15,

    color:
      colors.secondaryText,
  },

  weatherNotice: {
    marginTop: 16,

    padding: 14,

    borderRadius: 16,

    backgroundColor:
      colors.surface,
  },

  weatherNoticeTitle: {
    fontSize: 14,

    fontWeight: "700",

    color: colors.text,
  },

  weatherNoticeText: {
    fontSize: 13,

    lineHeight: 18,

    color:
      colors.secondaryText,

    marginTop: 4,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

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

  /* OUTFIT */

  outfitCard: {
    backgroundColor:
      colors.surface,

    borderRadius: 22,

    padding: 16,

    marginBottom: 28,

    borderWidth: 1,

    borderColor:
      colors.border,
  },

  clothingPlaceholder: {
    height: 75,

    borderRadius: 14,

    backgroundColor:
      colors.background,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },

  placeholderText: {
    color:
      colors.secondaryText,

    fontWeight: "500",
  },

  /* ACCESSORIES */

  accessoriesContainer: {
    marginBottom: 28,
  },

  accessoryCard: {
    width: 105,
    height: 105,

    backgroundColor:
      colors.surface,

    borderRadius: 18,

    marginRight: 12,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    borderColor:
      colors.border,
  },

  accessoryEmoji: {
    fontSize: 28,

    marginBottom: 8,
  },

  accessoryName: {
    fontSize: 13,

    color: colors.text,
  },

  /* CLOSET */

  closetButton: {
    backgroundColor:
      colors.accent,

    paddingVertical: 18,
    paddingHorizontal: 20,

    borderRadius: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",

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